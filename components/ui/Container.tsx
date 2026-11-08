import { cn } from '@/lib/cva';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'header' | 'footer' | 'main' | 'article';
}

export function Container({ children, className, as: Tag = 'div' }: ContainerProps) {
  return <Tag className={cn('container', className)}>{children}</Tag>;
}
