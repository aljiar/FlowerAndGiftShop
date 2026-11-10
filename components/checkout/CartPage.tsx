'use client';

import Link from 'next/link';
import Image from 'next/image';
import { X, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { products } from '@/lib/catalog';
import { QuantityControl } from '@/components/ui/QuantityControl';
import { DeliveryEstimate } from './DeliveryEstimate';
import { formatPrice } from '@/lib/format';

export function CartPage() {
  const hydrated = useCartStore((s) => s.hydrated);
  const items = useCartStore((s) => s.items);
  const update = useCartStore((s) => s.update);
  const remove = useCartStore((s) => s.remove);

  const lineItems = items.map((item) => {
    const product = products.find((p) => p._id === item.productId);
    const variant = product?.variants.find((v) => v.id === item.variantId);
    if (!product || !variant) return null;
    const unit = product.basePrice + variant.priceDelta;
    return { item, product, variant, unit, subtotal: unit * item.qty };
  }).filter(Boolean) as Array<{
    item: typeof items[number];
    product: typeof products[number];
    variant: typeof products[number]['variants'][number];
    unit: number;
    subtotal: number;
  }>;

  const subtotal = lineItems.reduce((acc, l) => acc + l.subtotal, 0);

  if (!hydrated) return <div className="container py-section" role="status">Cargando carrito…</div>;

  if (lineItems.length === 0) {
    return (
      <div className="container py-section text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-ivory mx-auto flex items-center justify-center mb-6">
            <ShoppingBag size={24} strokeWidth={1.25} className="text-muted" />
          </div>
          <h1 className="font-serif text-3xl mb-3">Tu carrito está vacío</h1>
          <p className="text-muted leading-relaxed mb-8">
            Explora flores y regalos, y consulta disponibilidad y entrega por WhatsApp.
          </p>
          <Link href="/coleccion" className="inline-flex items-center gap-2 bg-forest text-cream px-5 py-4 rounded-sm text-sm">
            Explorar colección <ArrowRight size={16} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-section grid lg:grid-cols-[1fr_360px] gap-10">
      <div>
        <span className="eyebrow mb-2">Tu selección</span>
        <h1 className="font-serif text-3xl md:text-4xl mb-8">Tu carrito</h1>

        <ul className="divide-y divide-line border-t border-b border-line">
          {lineItems.map(({ item, product, variant, unit }) => (
            <li key={item.id} className="py-5 flex gap-3 sm:gap-4">
              <Link
                href={`/producto/${product.slug}`}
                className="relative w-16 h-20 sm:w-24 sm:h-28 shrink-0 rounded-sm overflow-hidden bg-ivory"
              >
                <Image src={product.images[0].url} alt={product.images[0].alt} fill sizes="(min-width: 640px) 96px, 64px" className="object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-3">
                  <div>
                    <Link
                      href={`/producto/${product.slug}`}
                      className="font-serif text-lg text-forest hover:text-clay break-words"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-muted mt-0.5">{variant.label}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="w-11 h-11 inline-flex items-center justify-center text-forest hover:bg-ivory self-start shrink-0"
                    aria-label={`Quitar ${product.name}`}
                  >
                    <X size={14} strokeWidth={1.5} />
                  </button>
                </div>

                <textarea
                  aria-label={`Dedicatoria para ${product.name}`}
                  placeholder="Mensaje para la tarjeta (opcional)"
                  value={item.message || ''}
                  onChange={(e) =>
                    update(item.id, { message: e.target.value.slice(0, 180) })
                  }
                  rows={2}
                  maxLength={180}
                  className="mt-2 w-full bg-cream border border-line rounded-sm px-3 py-2 text-base"
                />

                <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                  <QuantityControl value={item.qty} onChange={qty => update(item.id, { qty })} label={`${product.name}, ${variant.label}`} />
                  <p className="font-serif text-base">{formatPrice(unit * item.qty)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex items-center justify-between">
          <Link href="/coleccion" className="text-sm text-forest hover:text-clay">
            ← Seguir comprando
          </Link>
        </div>
      </div>

      <aside className="lg:sticky lg:top-28 self-start h-fit border border-line rounded-sm p-6 bg-cream">
        <h2 className="font-serif text-xl mb-5">Resumen</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="text-forest">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Delivery</dt>
            <dd className="text-muted text-xs">A coordinar por WhatsApp</dd>
          </div>
        </dl>
        <div className="border-t border-line mt-4 pt-4 flex justify-between items-baseline">
          <span className="font-serif text-lg">Subtotal de referencia</span>
          <span className="font-serif text-2xl">{formatPrice(subtotal)}</span>
        </div>
        <div className="mt-5"><DeliveryEstimate subtotal={subtotal} /></div>
        <Link href="/checkout" className="flex items-center justify-center gap-2 mt-6 bg-clay text-cream px-6 py-4 rounded-sm text-sm uppercase tracking-wider">
          Revisar pedido <ArrowRight size={14} strokeWidth={1.5} />
        </Link>
        <p className="text-xs text-muted mt-3 text-center">
          Precios de ejemplo · Consulta el importe real antes de pagar
        </p>
      </aside>
    </div>
  );
}
