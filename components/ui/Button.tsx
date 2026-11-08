import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cva';

type Variant = 'primary' | 'secondary' | 'ghost' | 'link' | 'dark';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  asChild?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-clay text-cream hover:bg-clay-hover focus-visible:ring-clay/60 shadow-soft',
  secondary:
    'bg-transparent text-forest border border-forest/30 hover:border-forest hover:bg-forest/[0.03]',
  ghost: 'bg-transparent text-forest hover:bg-forest/[0.05]',
  link: 'bg-transparent text-forest underline-offset-4 hover:underline px-0',
  dark: 'bg-forest text-cream hover:bg-forest-soft'
};

const sizeStyles: Record<Size, string> = {
  sm: 'h-9 px-4 text-xs tracking-wider uppercase',
  md: 'h-11 px-6 text-xs tracking-wider uppercase',
  lg: 'h-13 px-8 text-sm tracking-wider uppercase py-4'
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium uppercase rounded-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed select-none',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
