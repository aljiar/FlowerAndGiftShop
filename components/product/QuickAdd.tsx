'use client';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import type { Product } from '@/types';
export function QuickAdd({ product }: { product: Product }) {
  const add = useCartStore(s => s.add);
  return <button type="button" disabled={!product.inStock} aria-label={`Añadir ${product.name} al carrito, ${product.variants[0].label}`} onClick={() => add({ productId: product._id, variantId: product.variants[0].id, qty: 1 })} className="mt-3 w-full border border-forest/25 rounded-sm px-2 py-3 text-xs text-forest inline-flex items-center justify-center gap-2 hover:bg-forest hover:text-cream disabled:opacity-50">
    <ShoppingBag size={14} />{product.inStock ? `Añadir · ${product.variants[0].label}` : 'No disponible'}
  </button>;
}
