const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { runInNewContext } = require('node:vm');
const ts = require('typescript');

function load(file, env = {}, dependencies = {}) {
  const exports = {};
  const source = ts.transpileModule(readFileSync(join(__dirname, '..', file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  }).outputText;
  runInNewContext(source, {
    exports, process: { env }, URL,
    require: name => dependencies[name] || require(name)
  }, { filename: file });
  return exports;
}

test('una activación incompleta o un dominio inválido mantiene bloqueados los pedidos', () => {
  for (const env of [
    {},
    { NEXT_PUBLIC_COMMERCE_READY: 'true' },
    { NEXT_PUBLIC_COMMERCE_READY: 'true', NEXT_PUBLIC_SITE_URL: 'not-a-url' },
    { NEXT_PUBLIC_COMMERCE_READY: 'true', NEXT_PUBLIC_SITE_URL: 'http://example.com' },
    { NEXT_PUBLIC_COMMERCE_READY: 'true', NEXT_PUBLIC_SITE_URL: 'https://user:password@example.com' },
    { NEXT_PUBLIC_SITE_URL: 'https://example.com' }
  ]) {
    assert.equal(load('lib/constants.ts', env).commerceReady, false);
  }
  const configured = load('lib/constants.ts', {
    NEXT_PUBLIC_COMMERCE_READY: 'true', NEXT_PUBLIC_SITE_URL: 'https://example.com/'
  });
  assert.equal(configured.commerceReady, true);
  assert.equal(configured.site.url, 'https://example.com');
});

test('el checkout de muestra rechaza solicitudes antes de guardar un pedido', async () => {
  let writes = 0;
  const route = load('app/api/checkout/route.ts', {}, {
    '@/lib/constants': load('lib/constants.ts'),
    '@/lib/orders': { checkoutSchema: { safeParse() { throw new Error('No debe procesar pedidos de ejemplo'); } } },
    '@/lib/server/order-store': { saveOrder() { writes++; throw new Error('No debe escribir'); } }
  });
  const response = await route.POST(new Request('https://example.com/api/checkout', { method: 'POST', body: 'not-json' }));
  assert.equal(response.status, 503);
  assert.match((await response.json()).error, /WhatsApp/);
  assert.equal(writes, 0);
});
