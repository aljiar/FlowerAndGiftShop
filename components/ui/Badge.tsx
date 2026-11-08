import { cn } from '@/lib/cva';

type BadgeVariant = 'default' | 'accent' | 'outline' | 'sale' | 'muted';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-forest text-cream',
  accent: 'bg-clay text-cream',
  outline: 'border border-line text-forest bg-transparent',
  sale: 'bg-clay text-cream',
  muted: 'bg-ivory text-muted'
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-[10px] uppercase tracking-wider font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
