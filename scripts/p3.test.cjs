const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const { mkdtempSync, readFileSync, rmSync } = require('node:fs');
const { join } = require('node:path');
const { tmpdir } = require('node:os');
const { runInNewContext } = require('node:vm');
const { DatabaseSync } = require('node:sqlite');
const { randomUUID } = require('node:crypto');
const ts = require('typescript');
const root = mkdtempSync(join(tmpdir(), 'norahs-p3-test-'));
process.env.NEXT_PUBLIC_METRICS_ENABLED = 'true';
process.env.NEXT_PUBLIC_COMMERCE_READY = 'false';
const compile = source => ts.transpileModule(source.replace("import 'server-only';", ''), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
require.extensions['.ts'] = (module, filename) => module._compile(compile(readFileSync(filename, 'utf8')), filename);
const domain = require('../lib/activity.ts');
const delivery = require('../lib/delivery.ts');
const now = new Date('2026-11-10T21:00:00Z');
function load(file, dependencies, globals = {}) {
  const exports = {};
  runInNewContext(compile(readFileSync(join(__dirname, '..', file), 'utf8')), {
    exports, require: name => Object.hasOwn(dependencies, name) ? dependencies[name] : require(name),
    process, Date, Map, Set, ...globals
  });
  return exports;
}
function stores(name) {
  process.env.METRICS_DB_PATH = join(root, name + '.sqlite');
  process.env.ORDERS_DB_PATH = join(root, name + '-orders.sqlite');
  const create = live => load('lib/server/activity-store.ts', { '../activity': domain, '../constants': { commerceReady: live }, '../delivery': delivery });
  return { preview: create(false), live: create(true) };
}

test('el contrato de métricas rechaza datos personales, URLs, modo, productos desconocidos y pedidos del cliente', () => {
  const valid = { event: 'product_view', source: 'product', productId: 'p-001' };
  assert.equal(domain.activitySchema.safeParse(valid).success, true);
  for (const extra of [{ email: 'secret@example.com' }, { message: 'Privado' }, { url: '/checkout/confirmacion?token=secret' }, { mode: 'live' }, { value: 500 }]) {
    assert.equal(domain.activitySchema.safeParse({ ...valid, ...extra }).success, false);
  }
  assert.equal(domain.activitySchema.safeParse({ ...valid, productId: 'unknown' }).success, false);
  assert.equal(domain.activitySchema.safeParse({ event: 'order_created', source: 'order' }).success, false);
  assert.equal(domain.activitySchema.safeParse({ event: 'whatsapp_click', source: 'order', productId: 'p-001' }).success, false);
});

test('el mapa de páginas no mide administración ni conserva enlaces privados', () => {
  assert.equal(domain.activityPage('/admin/pedidos'), undefined);
  assert.equal(domain.activityPage('/admin/metricas'), undefined);
  assert.equal(domain.activityPage('/producto/desconocido'), undefined);
  assert.deepEqual(domain.activityPage('/checkout/confirmacion'), { source: 'order', view: undefined });
  assert.deepEqual(domain.activityPage('/producto/jardin-en-rosa').view, { event: 'product_view', source: 'product', productId: 'p-001' });
});

test('el transporte no adjunta cookies o referencia y respeta DNT, GPC y fallos de red', () => {
  const calls = [];
  const window = { navigator: {}, location: { pathname: '/producto/jardin-en-rosa', href: 'https://example.com/checkout/confirmacion?token=secret' }, fetch: (url, options) => { calls.push({ url, options }); return Promise.resolve(); } };
  const tracker = load('lib/track-activity.ts', { './activity': domain }, { window });
  tracker.trackActivity({ event: 'whatsapp_click', source: 'order' });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, '/api/activity');
  assert.equal(calls[0].options.referrerPolicy, 'no-referrer');
  assert.equal(calls[0].options.credentials, 'omit');
  assert.equal(calls[0].options.keepalive, true);
  assert.doesNotMatch(calls[0].options.body, /secret|token|href/);
  window.navigator.doNotTrack = '1';
  tracker.trackCartAdd('p-001');
  window.navigator.doNotTrack = '0'; window.navigator.globalPrivacyControl = true;
  tracker.trackCartAdd('p-001');
  assert.equal(calls.length, 1);
  window.navigator.globalPrivacyControl = false;
  window.fetch = () => { throw Error('offline'); };
  assert.doesNotThrow(() => tracker.trackCartAdd('p-001'));
});

test('las acciones se agregan por día y el servidor separa pruebas y actividad real', () => {
  const { preview, live } = stores('separated');
  try {
    preview.recordActivity({ event: 'product_view', source: 'product', productId: 'p-001' }, now);
    preview.recordActivity({ event: 'product_view', source: 'product', productId: 'p-001' }, now);
    preview.recordActivity({ event: 'cart_add', source: 'product', productId: 'p-001' }, now);
    live.recordActivity({ event: 'whatsapp_click', source: 'contact' }, now);
    assert.equal(preview.readActivity('preview', 7, now).totals.product_view, 2);
    assert.equal(preview.readActivity('preview', 7, now).totals.whatsapp_click, 0);
    assert.equal(live.readActivity('live', 7, now).totals.product_view, 0);
    assert.equal(live.readActivity('live', 7, now).totals.whatsapp_click, 1);
    const db = new DatabaseSync(process.env.METRICS_DB_PATH, { readOnly: true });
    try {
      assert.equal(db.prepare('SELECT count(*) AS n FROM activity_counts').get().n, 3);
      assert.deepEqual(db.prepare('PRAGMA table_info(activity_counts)').all().map(row => row.name), ['day', 'mode', 'event', 'source', 'product_id', 'count']);
    } finally { db.close(); }
    preview.closeActivityStore();
    assert.equal(preview.readActivity('preview', 7, now).totals.cart_add, 1);
  } finally { preview.closeActivityStore(); live.closeActivityStore(); }
});

test('usa días de Bolivia y elimina los conteos que superan 90 días', () => {
  const { preview, live } = stores('retention');
  const nearMidnight = new Date('2026-11-11T02:00:00Z');
  try {
    preview.recordActivity({ event: 'cart_view', source: 'cart' }, new Date('2026-07-01T16:00:00Z'));
    preview.recordActivity({ event: 'cart_view', source: 'cart' }, nearMidnight);
    const summary = preview.readActivity('preview', 7, nearMidnight);
    assert.equal(summary.to, '2026-11-10');
    assert.equal(summary.totals.cart_view, 1);
    const db = new DatabaseSync(process.env.METRICS_DB_PATH, { readOnly: true });
    try { assert.equal(db.prepare('SELECT count(*) AS n FROM activity_counts').get().n, 1); } finally { db.close(); }
  } finally { preview.closeActivityStore(); live.closeActivityStore(); }
});

test('un fallo de métricas no impide guardar el pedido y los reintentos no duplican el contador', () => {
  const orderStore = require('../lib/server/order-store.ts');
  const metricStore = require('../lib/server/activity-store.ts');
  process.env.ORDERS_DB_PATH = join(root, 'orders.sqlite');
  process.env.METRICS_DB_PATH = process.env.ORDERS_DB_PATH;
  const date = delivery.deliveryDates().find(date => date.available).value;
  const data = { requestId: randomUUID(), buyer: { name: 'QA', phone: '+59170000000' }, delivery: { recipientName: 'QA', recipientPhone: '+59170000001', zoneId: 'centro', address: 'Direccion de QA', date, slotId: delivery.availableSlots(date)[0].id }, payment: { method: 'qr' }, items: [{ productId: 'p-001', variantId: 'jr-s', qty: 1 }] };
  try {
    const first = orderStore.saveOrder(data);
    assert.ok(first.id);
    process.env.METRICS_DB_PATH = join(root, 'orders-metrics.sqlite');
    const next = { ...data, requestId: randomUUID() };
    const second = orderStore.saveOrder(next);
    assert.equal(orderStore.saveOrder(next).id, second.id);
    assert.equal(metricStore.readActivity('preview', 7).totals.order_created, 1);
  } finally { orderStore.closeOrderStore(); metricStore.closeActivityStore(); }
});

after(() => rmSync(root, { recursive: true }));
