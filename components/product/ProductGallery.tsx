'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/cva';
import type { ProductImage } from '@/types';

interface Props {
  images: ProductImage[];
}

export function ProductGallery({ images }: Props) {
  const [active, setActive] = useState(0);

  return (
    <div><div className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-4">
      <div className="order-2 md:order-1 flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible">
        {images.map((img, i) => (
          <button
            key={img.url}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Ver imagen ${i + 1}`}
            aria-pressed={i === active}
            className={cn(
              'relative shrink-0 w-16 h-20 md:w-20 md:h-24 rounded-sm overflow-hidden border-2 transition-colors',
              i === active ? 'border-forest' : 'border-transparent hover:border-line'
            )}
          >
            <Image src={img.url} alt={img.alt} fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>
      <div className="order-1 md:order-2 relative aspect-[4/5] bg-ivory rounded-sm overflow-hidden">
        <Image
          src={images[active].url}
          alt={images[active].alt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    </div><p className="text-xs text-muted mt-3">Fotografías de referencia. Consulta la composición del arreglo antes de confirmar el pago.</p></div>
  );
}
