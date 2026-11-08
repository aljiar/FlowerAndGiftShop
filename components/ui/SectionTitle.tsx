import { cn } from '@/lib/cva';

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  as: Tag = 'h2'
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 max-w-2xl',
        align === 'center' && 'mx-auto items-center text-center',
        className
      )}
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <Tag className="text-3xl md:text-4xl lg:text-5xl font-serif font-light leading-[1.05] tracking-editorial text-balance">
        {title}
      </Tag>
      {description && (
        <p className="text-base text-muted text-pretty leading-relaxed max-w-prose">
          {description}
        </p>
      )}
    </div>
  );
}
