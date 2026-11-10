'use client';

import { useState } from 'react';
import { Check, ShoppingBag, Truck, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Field';
import { useCartStore } from '@/lib/store/useCartStore';
import { site } from '@/lib/constants';
import { formatPrice } from '@/lib/format';
import type { Product } from '@/types';

interface Props {
  product: Product;
}

export function ProductBuyBox({ product }: Props) {
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [message, setMessage] = useState('');
  const [added, setAdded] = useState(false);
  const addToCart = useCartStore((s) => s.add);

  const variant = product.variants.find((v) => v.id === variantId)!;
  const unitPrice = product.basePrice + variant.priceDelta;

  const handleAdd = () => {
    if (!product.inStock) return;
    addToCart({
      productId: product._id,
      variantId,
      qty: 1,
      message: message || undefined,

    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className="lg:sticky lg:top-28 self-start space-y-6">
      <header className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {product.tags.includes('nuevo') && <Badge variant="accent">Nuevo</Badge>}
          {product.tags.includes('best') && <Badge variant="default">Favorito</Badge>}
          {product.tags.includes('edicion-limitada') && <Badge variant="outline">Edición limitada</Badge>}
          {product.compareAtPrice && product.compareAtPrice > product.basePrice && (
            <Badge variant="sale">Oferta</Badge>
          )}
        </div>
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.05] tracking-editorial">
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
        <div className="grid grid-cols-3 gap-2">
          {product.variants.map((v) => {
            const active = v.id === variantId;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setVariantId(v.id)}
                aria-pressed={active}
                className={`text-left p-3 rounded-sm border transition-colors ${
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
      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        <Button
          size="lg"
          fullWidth
          onClick={handleAdd}
          aria-label="Añadir al carrito"
          disabled={!product.inStock}
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
    </div>
  );
}
