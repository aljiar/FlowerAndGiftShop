const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { randomUUID } = require('node:crypto');
const { runInNewContext } = require('node:vm');
const ts = require('typescript');

function loadModule(file, globals = {}, dependencies = {}) {
  const exports = {};
  const source = ts.transpileModule(readFileSync(join(__dirname, '..', file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  }).outputText;
  runInNewContext(source, {
    exports, require: name => dependencies[name] || require(name),
    crypto: { randomUUID }, ...globals
  }, { filename: file });
  return exports;
}
const catalog = loadModule('lib/catalog.ts');
const product = catalog.products.find(p => p.inStock);
const item = { productId: product._id, variantId: product.variants[0].id, qty: 2, message: 'Para ti' };
const key = 'petalo-cart-v1';
function loadCart(globals) {
  return loadModule('lib/store/useCartStore.ts', globals, { '@/lib/catalog': catalog });
}
function memoryStorage() {
  const data = new Map();
  return {
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    removeItem: key => data.delete(key)
  };
}

test('SSR no recupera ni escribe el carrito, aunque Node exponga localStorage indefinido', async () => {
  const { useCartStore, hydrateCart } = loadCart({ localStorage: undefined });
  await hydrateCart();
  assert.equal(useCartStore.getState().hydrated, false);
  assert.equal(useCartStore.getState().items.length, 0);
});

test('recupera el carrito tras montar y conserva cantidades y dedicatorias al recargar', async () => {
  const storage = memoryStorage();
  const first = loadCart({ window: { localStorage: storage } });
  await first.hydrateCart();
  first.useCartStore.getState().add(item);
  const id = first.useCartStore.getState().items[0].id;
  first.useCartStore.getState().update(id, { qty: 3, message: 'Feliz día' });

  const reloaded = loadCart({ window: { localStorage: storage } });
  assert.equal(reloaded.useCartStore.getState().items.length, 0);
  assert.equal(reloaded.useCartStore.getState().hydrated, false);
  await reloaded.hydrateCart();
  const restored = reloaded.useCartStore.getState().items[0];
  assert.equal(reloaded.useCartStore.getState().hydrated, true);
  assert.equal(restored.id, id);
  assert.equal(restored.qty, 3);
  assert.equal(restored.message, 'Feliz día');
  assert.equal(reloaded.useCartStore.getState().isOpen, false);
  reloaded.useCartStore.getState().remove(id);
  const empty = loadCart({ window: { localStorage: storage } });
  await empty.hydrateCart();
  assert.equal(empty.useCartStore.getState().items.length, 0);
});

test('el carrito sigue operativo cuando el navegador bloquea localStorage', async () => {
  const browser = {};
  Object.defineProperty(browser, 'localStorage', { get() { throw new Error('SecurityError'); } });
  const { useCartStore, hydrateCart } = loadCart({ window: browser });
  await hydrateCart();
  assert.equal(useCartStore.getState().hydrated, true);
  useCartStore.getState().add(item);
  assert.equal(useCartStore.getState().count(), 2);
  useCartStore.getState().clear();
  assert.equal(useCartStore.getState().count(), 0);
});

test('un fallo de escritura no impide añadir productos ni recuperarlos en memoria', async () => {
  const storage = memoryStorage();
  storage.setItem = () => { throw new Error('QuotaExceededError'); };
  const { useCartStore, hydrateCart } = loadCart({ window: { localStorage: storage } });
  await hydrateCart();
  useCartStore.getState().add(item);
  assert.equal(useCartStore.getState().count(), 2);
});

test('datos corruptos no dejan el carrito cargando indefinidamente', async () => {
  const storage = memoryStorage();
  storage.setItem(key, '{invalid json');
  const { useCartStore, hydrateCart } = loadCart({ window: { localStorage: storage } });
  await hydrateCart();
  assert.equal(useCartStore.getState().hydrated, true);
  useCartStore.getState().add(item);
  assert.equal(JSON.parse(storage.getItem(key)).state.items[0].qty, 2);
});

test('migra los carritos anteriores y conserva artículos con dedicatorias distintas', async () => {
  const storage = memoryStorage();
  storage.setItem(key, JSON.stringify({ version: 1, state: { items: [item, { ...item, message: 'Otra tarjeta' }] } }));
  const { useCartStore, hydrateCart } = loadCart({ window: { localStorage: storage } });
  await hydrateCart();
  const items = useCartStore.getState().items;
  assert.equal(items.length, 2);
  assert.notEqual(items[0].id, items[1].id);
  assert.equal(items[1].message, 'Otra tarjeta');
  assert.equal(JSON.parse(storage.getItem(key)).version, 2);
});
