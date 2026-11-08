const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const { mkdtempSync, readFileSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { randomUUID } = require('node:crypto');
const ts = require('typescript');

// Ejecuta los módulos TS reales con Node y SQLite; el marcador server-only
// pertenece al empaquetador de Next y no tiene comportamiento de negocio.
require.extensions['.ts'] = (module, filename) => {
  const source = readFileSync(filename, 'utf8').replace("import 'server-only';", '');
  module._compile(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, filename);
};
const temp = mkdtempSync(join(tmpdir(), 'petalo-mvp-'));
process.env.ORDERS_DB_PATH = join(temp, 'orders.sqlite');
process.env.ADMIN_PASSWORD = 'test-only-password-with-enough-length';
const delivery = require('../lib/delivery.ts');
const { checkoutSchema, priceOrder } = require('../lib/orders.ts');
const { products } = require('../lib/catalog.ts');
const store = require('../lib/server/order-store.ts');
const auth = require('../lib/server/admin.ts');
const now = new Date('2026-11-07T16:00:00Z'); // Sábado, 12:00 en Bolivia.
function input(date = '2026-11-09') {
  return { requestId: randomUUID(), buyer: { name: 'Prueba MVP', email: 'test@example.com', phone: '+59170000000' }, delivery: { recipientName: 'Destinatario', recipientPhone: '+59170000001', zoneId: 'centro', address: 'Calle de prueba 123', date, slotId: '16-18' }, payment: { method: 'qr' }, items: [{ productId: products[0]._id, variantId: products[0].variants[0].id, qty: 1, message: 'Primera tarjeta' }] };
}
test('usa el día de Bolivia cerca del cambio de fecha UTC', () => {
  assert.equal(delivery.localDate(new Date('2026-11-08T02:00:00Z')), '2026-11-07');
  assert.equal(delivery.localMinutes(now), 720);
});
test('rechaza domingos, fechas inexistentes, pasadas y fuera del horizonte', () => {
  for (const date of ['2026-11-08', '2026-02-30', '2026-11-06', '2026-11-15', 'invalid']) assert.equal(delivery.availableDate(date, now), false, date);
});
test('cierra entregas de hoy a las 14:00 y respeta preparación', () => {
  assert.deepEqual(delivery.availableSlots('2026-11-07', now).map(s => s.id), ['14-16', '16-18', '18-20']);
  assert.equal(delivery.availableSlots('2026-11-07', new Date('2026-11-07T18:00:00Z')).length, 0);
  assert.equal(delivery.availableSlots('2026-11-08', now).length, 0);
});
test('valida destinatario, cantidades y pago manual', () => {
  const data = input();
  assert.equal(checkoutSchema.safeParse(data).success, true);
  assert.equal(checkoutSchema.safeParse({ ...data, delivery: { ...data.delivery, recipientName: '' } }).success, false);
  assert.equal(checkoutSchema.safeParse({ ...data, items: [{ ...data.items[0], qty: -1 }] }).success, false);
  assert.equal(checkoutSchema.safeParse({ ...data, payment: { method: 'card' } }).success, false);
});
test('ignora totales del cliente y calcula precio y envío en servidor', () => {
  const data = input();
  const validated = checkoutSchema.parse({ ...data, totals: { total: 1 } });
  const order = priceOrder(validated, now);
  const expected = products[0].basePrice + products[0].variants[0].priceDelta;
  assert.equal(order.totals.subtotal, expected);
  assert.equal(order.totals.total, expected + (expected >= 280 ? 0 : 15));
  assert.equal(order.delivery.recipientName, 'Destinatario');
});
test('rechaza producto, variante, zona y franja inválidos', () => {
  const data = input();
  assert.throws(() => priceOrder({ ...data, items: [{ ...data.items[0], productId: 'inexistente' }] }, now), /disponible/);
  assert.throws(() => priceOrder({ ...data, items: [{ ...data.items[0], variantId: 'inexistente' }] }, now), /disponible/);
  assert.throws(() => priceOrder({ ...data, delivery: { ...data.delivery, zoneId: 'otra' } }, now), /zona/);
  assert.throws(() => priceOrder({ ...data, delivery: { ...data.delivery, slotId: 'otra' } }, now), /franja/);
});
test('aplica envío gratis al alcanzar el umbral', () => {
  const data = input(); data.items[0].qty = 10;
  assert.equal(priceOrder(data, now).totals.deliveryFee, 0);
});
test('guarda una sola vez, recupera reintentos y conserva dedicatorias', () => {
  const date = delivery.deliveryDates().find(d => d.available).value;
  const data = input(date); data.delivery.slotId = delivery.availableSlots(date)[0].id;
  data.items.push({ ...data.items[0], message: 'Segunda tarjeta' });
  const first = store.saveOrder(data), retry = store.saveOrder(data);
  assert.equal(first.id, retry.id);
  assert.equal(first.accessToken, retry.accessToken);
  assert.equal(store.listOrders().length, 1);
  assert.equal(store.getOrder(first.id).items[1].message, 'Segunda tarjeta');
  assert.throws(() => store.saveOrder({ ...data, notes: 'Pedido diferente' }), /intento ya/);
  assert.equal(store.updateOrder(first.id, 'confirmed').status, 'confirmed');
  assert.equal(store.getOrder(first.id).status, 'confirmed');
  // Una conexión independiente comprueba que el pedido quedó en disco.
  const { DatabaseSync } = require('node:sqlite');
  const db = new DatabaseSync(process.env.ORDERS_DB_PATH);
  assert.equal(db.prepare('SELECT count(*) AS n FROM orders').get().n, 1);
  db.close();
});
test('las consultas se conservan y son consultables por el negocio', () => {
  store.saveInquiry({ name: 'Consulta de prueba', email: 'test@example.com' });
  assert.equal(store.listInquiries()[0].name, 'Consulta de prueba');
});
test('administración rechaza claves incorrectas y sesiones alteradas', () => {
  assert.equal(auth.validPassword('incorrecta'), false);
  assert.equal(auth.validPassword(process.env.ADMIN_PASSWORD), true);
  const session = auth.createSession();
  assert.equal(auth.validSession(session), true);
  assert.equal(auth.validSession(session + 'x'), false);
  assert.equal(auth.validSession('1.invalid'), false);
});
after(() => {
  store.closeOrderStore();
  rmSync(temp, { recursive: true });
});
