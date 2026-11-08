import { Star } from 'lucide-react';
import { cn } from '@/lib/cva';

interface RatingStarsProps {
  value: number;
  max?: number;
  size?: number;
  className?: string;
  showValue?: boolean;
}

export function RatingStars({ value, max = 5, size = 14, className, showValue }: RatingStarsProps) {
  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      <div className="flex" aria-label={`${value} de ${max} estrellas`}>
        {Array.from({ length: max }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={cn(
              i < Math.round(value)
                ? 'fill-clay text-clay'
                : 'fill-line text-line'
            )}
            strokeWidth={1.25}
          />
        ))}
      </div>
      {showValue && <span className="text-xs text-muted ml-1">{value.toFixed(1)}</span>}
    </div>
  );
}
