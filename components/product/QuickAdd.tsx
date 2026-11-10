'use client';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { trackCartAdd } from '@/lib/track-activity';
import type { Product } from '@/types';

export function QuickAdd({ product }: { product: Product }) {
  const add = useCartStore(state => state.add);
  const hydrated = useCartStore(state => state.hydrated);
  const style = 'mt-3 min-h-11 w-full border border-forest/30 rounded-sm px-2 py-3 text-sm text-forest inline-flex items-center justify-center gap-2 hover:bg-forest hover:text-cream disabled:opacity-50 text-center';
  if (product.inStock && product.variants.length > 1) return <Link href={`/producto/${product.slug}#opciones-producto`} className={style} aria-label={`Elegir tamaño de ${product.name}`}>Elegir tamaño</Link>;
  return <button type="button" disabled={!product.inStock || !hydrated} aria-label={`Añadir ${product.name} al carrito, ${product.variants[0].label}`} onClick={() => { const before = useCartStore.getState().count(); add({ productId: product._id, variantId: product.variants[0].id, qty: 1 }); if (useCartStore.getState().count() > before) trackCartAdd(product._id); }} className={style}><ShoppingBag size={16} className="shrink-0" aria-hidden="true" />{product.inStock ? 'Añadir' : 'No disponible'}</button>;
}
