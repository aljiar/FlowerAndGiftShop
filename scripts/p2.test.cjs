const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const { mkdtempSync, rmSync, readFileSync } = require('node:fs');
const { join } = require('node:path');
const { tmpdir } = require('node:os');
const { DatabaseSync } = require('node:sqlite');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => {
  module._compile(ts.transpileModule(readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
};
const { orderMessages, progressFor } = require('../lib/order-progress.ts');
const { isSameOrigin } = require('../lib/server/request-origin.ts');
const root = mkdtempSync(join(tmpdir(), 'norahs-p2-test-'));

test('la administración acepta el host local real y rechaza orígenes ajenos o encabezados reenviados', () => {
  const request = (origin, host = '127.0.0.1:3105', extra = {}) => new Request('http://localhost:3105/api/admin/session', { headers: { Origin: origin, Host: host, ...extra } });
  assert.equal(isSameOrigin(request('http://127.0.0.1:3105')), true);
  assert.equal(isSameOrigin(request('http://localhost:3105', 'localhost:3105')), true);
  assert.equal(isSameOrigin(request('https://otro.example')), false);
  assert.equal(isSameOrigin(request('https://otro.example', '127.0.0.1:3105', { 'X-Forwarded-Host': 'otro.example' })), false);
  assert.equal(isSameOrigin(request('https://127.0.0.1:3105')), false);
  assert.equal(isSameOrigin(request('null')), false);
});

test('cada estado tiene un siguiente paso y el cancelado no se presenta como pagado o entregado', () => {
  for (const status of ['pending', 'confirmed', 'preparing', 'delivered', 'cancelled']) {
    assert.ok(orderMessages[status].title);
    assert.ok(orderMessages[status].action);
    const current = progressFor(status).filter(stage => stage.current);
    assert.equal(current.length, status === 'cancelled' ? 0 : 1);
  }
  assert.match(orderMessages.pending.description, /pendiente de pago/);
  assert.match(orderMessages.cancelled.description, /no ejecuta ni confirma un reembolso/);
  assert.doesNotMatch(orderMessages.delivered.action, /pago/i);
});

test('el respaldo incluye datos confirmados en WAL, excluye escrituras sin confirmar y puede restaurarse', async () => {
  const { snapshotOrderDatabase, inspectOrderDatabase } = await import('./order-backup.mjs');
  const source = join(root, 'source.sqlite');
  const backup = join(root, 'backup.sqlite');
  const restored = join(root, 'restored.sqlite');
  const db = new DatabaseSync(source);
  try {
    db.exec("PRAGMA journal_mode=WAL; PRAGMA wal_autocheckpoint=0; CREATE TABLE orders (id TEXT PRIMARY KEY, payload TEXT); CREATE TABLE inquiries (id TEXT PRIMARY KEY, payload TEXT); INSERT INTO orders VALUES ('qa-order', '{\"status\":\"preparing\"}'); INSERT INTO inquiries VALUES ('qa-inquiry', '{}'); BEGIN; INSERT INTO orders VALUES ('uncommitted', '{}');");
    assert.deepEqual(snapshotOrderDatabase(source, backup), { path: backup, orders: 1, inquiries: 1 });
    db.exec('ROLLBACK;');
    assert.deepEqual(snapshotOrderDatabase(backup, restored), { path: restored, orders: 1, inquiries: 1 });
    const recovered = new DatabaseSync(restored, { readOnly: true });
    try { assert.equal(JSON.parse(recovered.prepare('SELECT payload FROM orders WHERE id=?').get('qa-order').payload).status, 'preparing'); }
    finally { recovered.close(); }
    assert.deepEqual(inspectOrderDatabase(restored), { orders: 1, inquiries: 1 });
  } finally { db.close(); }
});

test('un respaldo nunca sobrescribe el origen, una copia previa ni crea una base de origen inexistente', async () => {
  const { snapshotOrderDatabase } = await import('./order-backup.mjs');
  const source = join(root, 'source.sqlite');
  const backup = join(root, 'backup.sqlite');
  assert.throws(() => snapshotOrderDatabase(source, source), /distinto/);
  assert.throws(() => snapshotOrderDatabase(source, source + '-wal'), /auxiliar/);
  assert.throws(() => snapshotOrderDatabase(source, backup), /ya existe/);
  assert.throws(() => snapshotOrderDatabase(join(root, 'missing.sqlite'), join(root, 'unused.sqlite')));
});

after(() => rmSync(root, { recursive: true }));
