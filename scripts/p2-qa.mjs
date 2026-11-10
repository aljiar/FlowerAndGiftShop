import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { randomBytes, randomUUID } from 'node:crypto';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createServer } from 'node:net';
import { snapshotOrderDatabase } from './order-backup.mjs';

if (process.argv.length !== 3 || process.argv[2] !== '--allow-demo-orders') {
  throw new Error('Esta prueba crea pedidos ficticios en una base nueva. Ejecuta: npm run qa:operations -- --allow-demo-orders');
}
const root = process.cwd();
const next = resolve('node_modules/next/dist/bin/next');
const directory = await mkdtemp(join(tmpdir(), 'norahs-p2-qa-'));
const database = join(directory, 'qa.sqlite');
const password = randomBytes(32).toString('hex');
const env = {
  ...process.env, NODE_ENV: 'production', NORAH_QA_BUILD: 'true',
  NEXT_PUBLIC_COMMERCE_READY: 'true', NEXT_PUBLIC_SITE_URL: 'https://example.com',
  ORDERS_DB_PATH: database, ADMIN_PASSWORD: password
};
let server;
const checks = [];
function passed(name) { checks.push(name); console.log(`OK ${name}`); }

function build() {
  return new Promise((resolveBuild, reject) => {
    const child = spawn(process.execPath, [next, 'build'], { cwd: root, env, windowsHide: true, stdio: 'inherit' });
    child.once('error', reject);
    child.once('exit', code => code === 0 ? resolveBuild() : reject(new Error('Falló la compilación de QA.')));
  });
}
async function port() {
  const socket = createServer();
  await new Promise((resolvePort, reject) => { socket.once('error', reject); socket.listen(0, '127.0.0.1', resolvePort); });
  const value = socket.address().port;
  await new Promise((resolveClose, reject) => socket.close(error => error ? reject(error) : resolveClose()));
  return value;
}
async function start(filename) {
  const selectedPort = await port();
  const child = spawn(process.execPath, [next, 'start', '-H', '127.0.0.1', '-p', String(selectedPort)], {
    cwd: root, env: { ...env, ORDERS_DB_PATH: filename }, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe']
  });
  server = child;
  await new Promise((ready, reject) => {
    const timeout = setTimeout(() => reject(new Error('El servidor de QA no inició a tiempo.')), 30000);
    child.once('error', error => { clearTimeout(timeout); reject(error); });
    child.once('exit', () => { clearTimeout(timeout); reject(new Error('El servidor de QA se cerró antes de estar listo.')); });
    child.stdout.on('data', value => { if (value.toString().includes('Ready')) { clearTimeout(timeout); ready(); } });
    // No se imprimen cuerpos de solicitudes, claves, enlaces privados ni datos de pedidos.
    child.stderr.on('data', () => {});
  });
  return `http://127.0.0.1:${selectedPort}`;
}
async function stop() {
  const child = server;
  server = undefined;
  if (!child || child.exitCode !== null) return;
  await new Promise(resolveStop => {
    const timeout = setTimeout(() => { child.kill('SIGKILL'); resolveStop(); }, 5000);
    child.once('exit', () => { clearTimeout(timeout); resolveStop(); });
    child.kill('SIGTERM');
  });
}
let base;
const post = (path, body, headers = {}) => fetch(base + path, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: base, ...headers }, body: JSON.stringify(body) });
async function login() {
  const response = await post('/api/admin/session', { password });
  assert.equal(response.status, 200);
  return response.headers.get('set-cookie').split(';')[0];
}
function receipt(order) { return `/checkout/confirmacion?id=${encodeURIComponent(order.orderId)}&token=${encodeURIComponent(order.accessToken)}`; }
async function patch(order, status, cookie) {
  return fetch(base + '/api/admin/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json', Origin: base, Cookie: cookie }, body: JSON.stringify({ id: order.orderId, status }) });
}

try {
  await build();
  base = await start(database);
  assert.equal((await fetch(base + '/como-comprar')).status, 200);
  assert.equal((await post('/api/checkout', {})).status, 400);
  const local = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/La_Paz', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const day = new Date(`${local}T12:00:00Z`);
  day.setUTCDate(day.getUTCDate() + 1);
  if (day.getUTCDay() === 0) day.setUTCDate(day.getUTCDate() + 1);
  const data = {
    requestId: randomUUID(), buyer: { name: 'Comprador ficticio P2', phone: '+59170000000' },
    delivery: { recipientName: 'Destinatario ficticio P2', recipientPhone: '+59170000001', zoneId: 'centro', address: 'Direccion ficticia de QA 123', date: day.toISOString().slice(0, 10), slotId: '10-12' },
    payment: { method: 'qr' }, notes: 'PRUEBA AISLADA: no enviar ni cobrar.',
    items: [{ productId: 'p-001', variantId: 'jr-s', qty: 1, message: 'Primera dedicatoria de QA' }, { productId: 'p-001', variantId: 'jr-s', qty: 1, message: 'Segunda dedicatoria de QA' }],
    totals: { total: 1 }
  };
  const responses = await Promise.all([post('/api/checkout', data), post('/api/checkout', data)]);
  assert.ok(responses.every(response => response.status === 200));
  const [first, retry] = await Promise.all(responses.map(response => response.json()));
  assert.ok(first.orderId === retry.orderId && first.accessToken === retry.accessToken, 'El reintento debe recuperar el mismo pedido.');
  assert.equal(first.totals.total, 600);
  const secondResponse = await post('/api/checkout', { ...data, requestId: randomUUID(), payment: { method: 'transfer' }, items: [{ productId: 'p-012', variantId: 'ds-m', qty: 1 }] });
  assert.equal(secondResponse.status, 200);
  const second = await secondResponse.json();
  assert.equal(second.totals.deliveryFee, 15);
  assert.equal(second.totals.total, 155);
  assert.equal((await post('/api/checkout', { ...data, notes: 'Contenido distinto con misma clave' })).status, 409);
  passed('pedidos ficticios, correo opcional, importes del servidor, envío y reintentos concurrentes');

  const original = await (await fetch(base + receipt(first))).text();
  assert.ok(original.includes('Primera dedicatoria de QA') && original.includes('Segunda dedicatoria de QA'));
  assert.ok(original.includes('Pendiente de pago'));
  assert.equal((await fetch(`${base}/checkout/confirmacion?id=${encodeURIComponent(first.orderId)}`)).status, 404);
  assert.equal((await fetch(`${base}/checkout/confirmacion?id=${encodeURIComponent(first.orderId)}&token=incorrecto`)).status, 404);
  assert.equal((await post('/api/admin/session', { password: 'incorrecta' })).status, 401);
  const unauthorized = await fetch(base + '/api/admin/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: first.orderId, status: 'delivered' }) });
  assert.equal(unauthorized.status, 401);
  let cookie = await login();
  assert.equal((await post('/api/admin/session', { password }, { Origin: 'https://otro.example' })).status, 403);
  const labels = { confirmed: 'Pago confirmado', preparing: 'En preparación', delivered: 'Pedido marcado como entregado.' };
  for (const status of ['confirmed', 'preparing', 'delivered']) {
    assert.equal((await patch(first, status, cookie)).status, 200);
    const html = await (await fetch(base + receipt(first))).text();
    assert.ok(html.includes(labels[status]), 'El enlace privado debe reflejar el estado guardado.');
  }
  assert.equal((await patch(second, 'cancelled', cookie)).status, 200);
  const cancelled = await (await fetch(base + receipt(second))).text();
  assert.ok(cancelled.includes('Pedido cancelado.') && cancelled.includes('no ejecuta ni confirma un reembolso'));
  assert.equal((await post('/api/consulta', { name: 'Consulta ficticia P2', email: 'qa@example.com', phone: '+59170000000', eventType: 'otro', date: '', guests: '', budget: '', message: 'Prueba local sin evento real.' })).status, 200);
  const admin = await (await fetch(base + '/admin/pedidos', { headers: { Cookie: cookie } })).text();
  assert.ok(admin.includes(first.orderId) && admin.includes(second.orderId) && admin.includes('Consulta ficticia P2'));
  passed('confirmación privada, administración protegida, estados y consulta ficticia');

  await stop();
  base = await start(database);
  assert.ok((await (await fetch(base + receipt(first))).text()).includes('Pedido marcado como entregado.'));
  assert.ok((await (await fetch(base + receipt(second))).text()).includes('Pedido cancelado.'));
  passed('persistencia de pedidos y estados después de reiniciar el servidor');

  const backup = snapshotOrderDatabase(database, join(directory, 'backup.sqlite'));
  assert.equal(backup.orders, 2);
  assert.equal(backup.inquiries, 1);
  const restored = snapshotOrderDatabase(backup.path, join(directory, 'restored.sqlite'));
  assert.equal(restored.orders, 2);
  assert.equal(restored.inquiries, 1);
  await stop();
  base = await start(restored.path);
  cookie = await login();
  const recovered = await (await fetch(base + '/admin/pedidos', { headers: { Cookie: cookie } })).text();
  assert.ok(recovered.includes(first.orderId) && recovered.includes(second.orderId) && recovered.includes('Consulta ficticia P2'));
  assert.ok((await (await fetch(base + receipt(first))).text()).includes('Pedido marcado como entregado.'));
  assert.ok((await (await fetch(base + receipt(second))).text()).includes('Pedido cancelado.'));
  assert.equal((await post('/api/checkout', data)).status, 200);
  passed('respaldo consistente y recuperación de pedidos, consultas, estados y reintentos');
  await mkdir(resolve('output'), { recursive: true });
  await writeFile(resolve('output/p2-qa-report.json'), JSON.stringify({ completedAt: new Date().toISOString(), status: 'passed', checks, orders: 2, inquiries: 1, fixtureDirectory: directory }, null, 2));
  console.log('P2 QA completa. Informe sin claves ni datos de pedidos: output/p2-qa-report.json');
} finally { await stop(); }
