'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useModal } from '@/lib/useModal';
import { X, Plus, Minus, ArrowRight } from 'lucide-react';
import { hydrateCart, useCartStore } from '@/lib/store/useCartStore';
import { products } from '@/lib/catalog';
import { formatPrice } from '@/lib/format';

export function CartDrawer() {
  useEffect(() => { void hydrateCart(); }, []);
  const panel = useRef<HTMLElement>(null);
  const isOpen = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);
  const items = useCartStore((s) => s.items);
  const update = useCartStore((s) => s.update);
  const remove = useCartStore((s) => s.remove);

  useModal(isOpen, close, panel);
  useEffect(() => { if (isOpen) { const onRoute = () => close(); window.addEventListener('popstate', onRoute); return () => window.removeEventListener('popstate', onRoute); } }, [isOpen, close]);

  const lineItems = items.map((item) => {
    const product = products.find((p) => p._id === item.productId);
    const variant = product?.variants.find((v) => v.id === item.variantId);
    if (!product || !variant || !product.inStock) return null;
    const unit = product.basePrice + variant.priceDelta;
    return { item, product, variant, unit, subtotal: unit * item.qty };
  }).filter((line): line is NonNullable<typeof line> => line !== null);
  const subtotal = lineItems.reduce((acc, l) => acc + l.subtotal, 0);

  if (!isOpen) return null;

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="absolute inset-0 bg-forest/30 backdrop-blur-sm" onClick={close} aria-hidden />
      <aside
        ref={panel}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={`absolute inset-y-0 right-0 w-full sm:w-[460px] bg-cream shadow-2xl flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Carrito"
      >
        <header className="flex items-center justify-between px-6 h-16 border-b border-line">
          <div>
            <p className="font-serif text-xl">Tu carrito</p>
            <p className="text-xs text-muted">
              {lineItems.length} {lineItems.length === 1 ? 'arreglo' : 'arreglos'}
            </p>
          </div>
          <button type="button" onClick={close} className="p-2 text-forest" aria-label="Cerrar carrito">
            <X size={20} strokeWidth={1.5} />
          </button>
        </header>

        {lineItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4">
            <div className="w-20 h-20 rounded-full bg-ivory flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="text-muted">
                <path d="M12 8c-2-3-7-2-7 2 0 5 7 9 7 9s7-4 7-9c0-4-5-5-7-2z" />
              </svg>
            </div>
            <div>
              <p className="font-serif text-xl mb-1">Tu carrito está vacío</p>
              <p className="text-sm text-muted max-w-xs">
                Empieza con un arreglo pensado para hoy. Entrega en 2–4 h en Cochabamba.
              </p>
            </div>
            <Link
              href="/coleccion"
              onClick={close}
              className="inline-flex items-center gap-2 bg-clay text-cream text-xs uppercase tracking-wider px-5 h-11 rounded-sm hover:bg-clay-hover"
            >
              Ver colección <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {lineItems.map(({ item, product, variant, unit }) => (
                <article key={item.id} className="flex gap-4 group">
                  <Link
                    href={`/producto/${product.slug}`}
                    onClick={close}
                    className="relative w-20 h-24 shrink-0 rounded-sm overflow-hidden bg-ivory"
                  >
                    <Image
                      src={product.images[0].url}
                      alt={product.images[0].alt}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/producto/${product.slug}`}
                      onClick={close}
                      className="font-serif text-base text-forest hover:text-clay line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-muted">{variant.label}</p>
                    {item.message && <p className="text-xs text-muted mt-1 line-clamp-2">{item.message}</p>}
                    <div className="flex items-center justify-between mt-2">
                      <div className="inline-flex items-center border border-line rounded-sm">
                        <button
                          type="button"
                          aria-label="Reducir cantidad"
                          onClick={() =>
                            update(item.id, {
                              qty: Math.max(1, item.qty - 1)
                            })
                          }
                          className="w-7 h-7 flex items-center justify-center text-forest/70 hover:bg-ivory"
                        >
                          <Minus size={12} strokeWidth={1.5} />
                        </button>
                        <span className="w-7 text-center text-sm">{item.qty}</span>
                        <button
                          type="button"
                          aria-label="Aumentar cantidad"
                          onClick={() =>
                            update(item.id, { qty: Math.min(99, item.qty + 1) })
                          }
                          className="w-7 h-7 flex items-center justify-center text-forest/70 hover:bg-ivory"
                        >
                          <Plus size={12} strokeWidth={1.5} />
                        </button>
                      </div>
                      <p className="text-sm text-forest">{formatPrice(unit * item.qty)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="self-start p-1 text-muted hover:text-clay"
                    aria-label={`Quitar ${product.name}`}
                  >
                    <X size={14} strokeWidth={1.5} />
                  </button>
                </article>
              ))}
            </div>

            <footer className="border-t border-line px-6 py-5 space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Delivery</span>
                  <span className="text-xs">Calculado en checkout</span>
                </div>

              </div>
              <div className="flex items-center justify-between pt-2 border-t border-line">
                <span className="font-serif text-xl">Subtotal</span>
                <span className="font-serif text-2xl">{formatPrice(subtotal)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={close}
                className="flex items-center justify-center gap-2 w-full bg-forest text-cream text-xs uppercase tracking-wider px-6 h-12 rounded-sm hover:bg-forest-soft"
              >
                Continuar al checkout <ArrowRight size={14} strokeWidth={1.5} />
              </Link>
              <button
                type="button"
                onClick={close}
                className="w-full text-xs uppercase tracking-wider text-muted hover:text-forest"
              >
                Seguir comprando
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
