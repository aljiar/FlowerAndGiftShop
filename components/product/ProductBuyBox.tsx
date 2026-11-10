'use client';
import Link from 'next/link';

import { useEffect, useRef, useState } from 'react';
import { Check, ShoppingBag, Truck, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DeliveryEstimate } from '@/components/checkout/DeliveryEstimate';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Field';
import { useCartStore } from '@/lib/store/useCartStore';
import { site, commerceReady } from '@/lib/constants';
import { formatPrice } from '@/lib/format';
import type { Product } from '@/types';

interface Props {
  product: Product;
}

export function ProductBuyBox({ product }: Props) {
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [message, setMessage] = useState('');
  const [added, setAdded] = useState(false);
  const hydrated = useCartStore(state => state.hydrated);
  const cta = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const [showBar, setShowBar] = useState(true);
  useEffect(() => {
    document.body.classList.add('has-mobile-buy-bar');
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(entries => setShowBar(!entries[0].isIntersecting));
    if (cta.current) observer?.observe(cta.current);
    return () => { observer?.disconnect(); document.body.classList.remove('has-mobile-buy-bar'); if (timer.current) clearTimeout(timer.current); };
  }, []);
  const addToCart = useCartStore((s) => s.add);

  const variant = product.variants.find((v) => v.id === variantId)!;
  const unitPrice = product.basePrice + variant.priceDelta;

  const handleAdd = () => {
    if (!product.inStock || !hydrated) return;
    addToCart({
      productId: product._id,
      variantId,
      qty: 1,
      message: message || undefined,

    });
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div id="opciones-producto" className="lg:sticky lg:top-28 self-start space-y-6 scroll-mt-28 min-w-0">
      <header className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {product.tags.includes('nuevo') && <Badge variant="accent">Nuevo</Badge>}
          {product.tags.includes('best') && <Badge variant="default">Favorito</Badge>}
          {product.tags.includes('edicion-limitada') && <Badge variant="outline">Edición limitada</Badge>}
          {product.compareAtPrice && product.compareAtPrice > product.basePrice && (
            <Badge variant="sale">Oferta</Badge>
          )}
        </div>
        <h1 className="hidden lg:block font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.05] tracking-editorial">
          {product.name}
        </h1>
        <p className="text-base text-muted leading-relaxed">{product.shortDescription}</p>
        <div className="flex items-baseline gap-3 pt-1">
          <p className="font-serif text-3xl text-forest">{formatPrice(unitPrice)}</p>
          {product.compareAtPrice && product.compareAtPrice > product.basePrice && (
            <p className="text-sm text-muted line-through">
              {formatPrice(product.compareAtPrice)}
            </p>
          )}
        </div>
      </header>

      {/* Variantes */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-muted">Tamaño</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {product.variants.map((v) => {
            const active = v.id === variantId;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setVariantId(v.id)}
                aria-pressed={active}
                className={`text-left min-h-16 p-3 rounded-sm min-w-0 break-words border transition-colors ${
                  active
                    ? 'border-forest bg-ivory/60'
                    : 'border-line hover:border-forest'
                }`}
              >
                <p className="text-sm font-medium text-forest">{v.label}</p>
                <p className="text-xs text-muted mt-1">
                  {formatPrice(product.basePrice + v.priceDelta)}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-sm bg-ivory/60 p-3 rounded-sm" aria-live="polite"><strong>{variant.label}:</strong> {variant.details || (variant.label.includes('·') ? 'Incluye ' + variant.label.split('·').slice(1).join('·').trim() + ', con composición de referencia.' : 'Consulta composición y medidas; la fotografía es de referencia.')}</p>
      {/* Mensaje tarjeta */}
      <Textarea
        label="Mensaje para la tarjeta (opcional)"
        name="message"
        placeholder="Escribe hasta 180 caracteres. Consulta las opciones de tarjeta al coordinar."
        value={message}
        onChange={(e) => setMessage(e.target.value.slice(0, 180))}
        maxLength={180}
        rows={3}
        hint={`${message.length}/180`}
      />

      <p className="text-sm text-muted">Catálogo de ejemplo. Consulta disponibilidad, dirección y fecha por WhatsApp antes de pagar; agregar al carrito no reserva el producto.</p>

      {/* CTA */}
      <div ref={cta} className="flex flex-col sm:flex-row gap-2 pt-2">
        <Button
          size="lg"
          fullWidth
          onClick={handleAdd}
          aria-label="Añadir al carrito"
          disabled={!product.inStock || !hydrated}
        >
          {added ? (
            <>
              <Check size={16} strokeWidth={1.5} /> Añadido al carrito
            </>
          ) : (
            <>
              <ShoppingBag size={16} strokeWidth={1.5} /> {product.inStock ? `Añadir al carrito · ${formatPrice(unitPrice)}` : 'No disponible'}
            </>
          )}
        </Button>

      </div>

      <DeliveryEstimate subtotal={unitPrice} />
      <Link href="/como-comprar#composicion" className="inline-flex items-center min-h-11 text-sm underline">Qué confirmar sobre fotos, composición y entrega</Link>
      {/* Avisos */}
      <ul className="space-y-3 pt-2 text-xs text-muted border-t border-line">
        <li className="flex items-start gap-3">
          <Truck size={14} strokeWidth={1.5} className="mt-0.5 text-clay shrink-0" />
          <span>
            Entrega en {site.city} a coordinar. Confirma disponibilidad, plazo y tarifa por WhatsApp antes de pagar.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <Calendar size={14} strokeWidth={1.5} className="mt-0.5 text-clay shrink-0" />
          <span>
            Consulta las fechas disponibles. La selección de una fecha no reserva una entrega.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <Clock size={14} strokeWidth={1.5} className="mt-0.5 text-clay shrink-0" />
          <span>
            Zonas y tarifas de entrega pendientes de definir; acordaremos el total antes del pago.
          </span>
        </li>
      </ul>
      {showBar && <div data-mobile-buy-bar className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-cream border-t border-line shadow-soft px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center gap-3 justify-between">
            <div className="min-w-0"><p className="font-serif text-xl">{formatPrice(unitPrice)}</p><p className="text-xs text-muted break-words">{variant.label}{!commerceReady ? ' · referencia' : ''}</p></div>
            <Button className="shrink-0" onClick={handleAdd} disabled={!product.inStock || !hydrated} aria-label={`Añadir al carrito: ${product.name}, ${variant.label}`}>{product.inStock ? 'Añadir' : 'No disponible'}</Button>
          </div>
          <a href="#opciones-producto" className="min-h-11 inline-flex items-center text-sm underline">Elegir tamaño y dedicatoria</a>
        </div>
      </div>}
    </div>
  );
}
