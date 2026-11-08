import Image from 'next/image';
import Link from 'next/link';
import { QuickAdd } from './QuickAdd';
import { Badge } from '@/components/ui/Badge';
import { productPriceRange } from '@/lib/catalog';
import { formatPrice } from '@/lib/format';
import type { Product } from '@/types';
import { cn } from '@/lib/cva';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  className?: string;
}

export function ProductCard({ product, priority, className }: ProductCardProps) {
  const range = productPriceRange(product);
  const hasDiscount = !!product.compareAtPrice && product.compareAtPrice > product.basePrice;

  return (
    <article className={cn('group relative', className)}>
      <Link
        href={`/producto/${product.slug}`}
        className="block relative aspect-[4/5] overflow-hidden bg-ivory rounded-sm"
      >
        <Image
          src={product.images[0].url}
          alt={product.images[0].alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-x-3 top-3 flex flex-wrap gap-1.5">
          {product.tags.includes('nuevo') && <Badge variant="accent">Nuevo</Badge>}
          {product.tags.includes('best') && <Badge variant="default">Favorito</Badge>}
          {product.tags.includes('edicion-limitada') && (
            <Badge variant="outline" className="bg-cream/85 backdrop-blur">Edición limitada</Badge>
          )}
          {hasDiscount && <Badge variant="sale">Oferta</Badge>}
        </div>
        {!product.inStock && <span className="absolute bottom-3 left-3 bg-cream px-3 py-1 text-xs">No disponible</span>}
      </Link>

      <div className="pt-4 px-1">
        <Link href={`/producto/${product.slug}`} className="block group/title">
          <h3 className="font-serif text-lg text-forest group-hover/title:text-clay transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted mt-1 line-clamp-2 min-h-[2rem]">
          {product.shortDescription}
        </p>
        <div className="flex items-baseline gap-2 mt-2">
          <p className="font-serif text-base text-forest">{formatPrice(range.min)}</p>
          {range.min !== range.max && (
            <span className="text-xs text-muted">– {formatPrice(range.max)}</span>
          )}
          {hasDiscount && (
            <span className="text-xs text-muted line-through ml-1">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>
        <QuickAdd product={product} />
      </div>
    </article>
  );
}
