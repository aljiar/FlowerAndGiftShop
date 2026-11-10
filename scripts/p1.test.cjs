const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  module._compile(ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  }).outputText, filename);
};
const { products } = require('../lib/catalog.ts');
const { categories } = require('../lib/categories.ts');
const { readFilters, filterQuery, filterProducts, emptyFilters } = require('../lib/catalog-filters.ts');
const { checkoutErrors, checkoutPayload, readCheckoutDraft, saveCheckoutDraft, clearCheckoutDraft, draftKey, initialCheckoutForm } = require('../lib/checkout-draft.ts');
const { checkoutSchema } = require('../lib/orders.ts');
const now = new Date('2026-11-07T16:00:00Z');
const form = { ...initialCheckoutForm, buyerName: 'Cliente de prueba', phone: '+59170000000', recipientName: 'Destinatario', recipientPhone: '+59170000001', address: 'Calle de prueba 123', zoneId: 'centro', date: '2026-11-09', slotId: '16-18', notes: 'Avisar al llegar', references: 'Puerta azul', method: 'transfer' };
function storage() {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
}

test('todos los productos tienen una categoría válida y las categorías nuevas no inventan stock', () => {
  for (const product of products) assert.ok(categories.some(category => category.slug === product.category));
  assert.equal(filterProducts(products, { ...emptyFilters, categories: ['plantas'] })[0].slug, 'capullo');
  for (const category of ['flores-eternas', 'globos', 'peluches', 'combos']) {
    assert.equal(filterProducts(products, { ...emptyFilters, categories: [category] }).length, 0);
  }
});

test('los enlaces conservan filtros múltiples, precio cero, orden y tamaños al recargar', () => {
  const selection = readFilters(new URLSearchParams('category=flores-naturales&category=plantas&occasion=amor&occasion=cumpleanos&flower=rosas&size=S&size=L&priceMin=0&priceMax=350&sort=precio-asc'));
  assert.deepEqual(readFilters(new URLSearchParams(filterQuery(selection))), selection);
  assert.equal(selection.categories.length, 2);
  assert.equal(selection.priceMin, '0');
  assert.equal(selection.sizes.length, 2);
});

test('ignora parámetros desconocidos, duplicados y precios inválidos', () => {
  const selection = readFilters(new URLSearchParams('category=fake&category=plantas&category=plantas&size=XXL&priceMin=-2&priceMax=Infinity&sort=fake&occasion=__proto__'));
  assert.deepEqual(selection.categories, ['plantas']);
  assert.deepEqual(selection.occasions, []);
  assert.deepEqual(selection.sizes, []);
  assert.equal(selection.priceMin, '');
  assert.equal(selection.priceMax, '');
  assert.equal(selection.sort, 'relevancia');
});

test('tamaño y presupuesto deben coincidir en la misma variante', () => {
  const product = products.find(product => product.slug === 'jardin-en-rosa');
  assert.equal(filterProducts([product], { ...emptyFilters, sizes: ['L'], priceMax: '350' }).length, 0);
  assert.equal(filterProducts([product], { ...emptyFilters, sizes: ['S'], priceMin: '300', priceMax: '300' }).length, 1);
  assert.equal(filterProducts([product], { ...emptyFilters, priceMin: '500', priceMax: '600' }).length, 1);
  assert.equal(filterProducts([product], { ...emptyFilters, priceMin: '600', priceMax: '300' }).length, 0);
});

test('el correo es opcional, pero un correo escrito debe ser válido', () => {
  assert.equal(checkoutSchema.shape.buyer.safeParse(checkoutPayload(form).buyer).success, true);
  assert.equal(checkoutSchema.shape.buyer.safeParse({ name: form.buyerName, phone: form.phone }).success, true);
  assert.equal(checkoutSchema.shape.buyer.safeParse({ ...checkoutPayload(form).buyer, email: 'invalid' }).success, false);
  assert.equal(checkoutErrors(form, 1, now).email, undefined);
  assert.match(checkoutErrors({ ...form, phone: 'abcdefg' }, 1, now).phone, /teléfono/);
});

test('asocia errores de entrega al campo correcto y vuelve a validar fechas vencidas', () => {
  assert.deepEqual(checkoutErrors(form, 2, now), {});
  assert.match(checkoutErrors({ ...form, zoneId: '' }, 2, now).zoneId, /zona/);
  assert.match(checkoutErrors({ ...form, slotId: 'invalid' }, 2, now).slotId, /franja/);
  assert.match(checkoutErrors({ ...form, date: '2026-11-08' }, 2, now).date, /fecha/);
});

test('recupera todos los datos y el paso del borrador después de una recarga', () => {
  const saved = storage();
  saveCheckoutDraft(saved, { form, step: 3 }, now.getTime());
  assert.deepEqual(readCheckoutDraft(saved, now.getTime() + 1000), { form, step: 3 });
  clearCheckoutDraft(saved);
  assert.equal(saved.getItem(draftKey), null);
});

test('un borrador vencido, corrupto o de otra versión no rompe el checkout', () => {
  const saved = storage();
  saveCheckoutDraft(saved, { form, step: 3 }, now.getTime());
  assert.equal(readCheckoutDraft(saved, now.getTime() + 2 * 60 * 60 * 1000 + 1).step, 1);
  assert.equal(saved.getItem(draftKey), null);
  saved.setItem(draftKey, '{invalid');
  assert.deepEqual(readCheckoutDraft(saved, now.getTime()).form, initialCheckoutForm);
  saved.setItem(draftKey, JSON.stringify({ version: 2, savedAt: now.getTime(), form, step: 3 }));
  assert.equal(readCheckoutDraft(saved, now.getTime()).form.buyerName, '');
});

test('un borrador con franja vencida vuelve a entrega sin perder datos del destinatario', () => {
  const saved = storage();
  saveCheckoutDraft(saved, { form: { ...form, date: '2026-11-08' }, step: 3 }, now.getTime());
  const draft = readCheckoutDraft(saved, now.getTime());
  assert.equal(draft.step, 2);
  assert.equal(draft.form.recipientName, form.recipientName);
});

test('si el navegador bloquea el almacenamiento, guardar y borrar no lanzan errores', () => {
  const blocked = { getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); }, removeItem() { throw Error('blocked'); } };
  assert.doesNotThrow(() => saveCheckoutDraft(blocked, { form, step: 1 }));
  assert.doesNotThrow(() => clearCheckoutDraft(blocked));
  assert.equal(readCheckoutDraft(blocked).step, 1);
});
