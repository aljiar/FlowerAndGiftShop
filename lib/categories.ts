import type { ProductCategory } from '@/types';

export const categories: Array<{ slug: ProductCategory; name: string; description: string }> = [
  { slug: 'flores-naturales', name: 'Flores naturales', description: 'Ramos y arreglos para regalar.' },
  { slug: 'flores-eternas', name: 'Flores eternas', description: 'Detalles para conservar.' },
  { slug: 'globos', name: 'Globos', description: 'Ideas para celebrar.' },
  { slug: 'peluches', name: 'Peluches', description: 'Un detalle para acompañar.' },
  { slug: 'combos', name: 'Combos', description: 'Flores y regalos juntos.' },
  { slug: 'plantas', name: 'Plantas', description: 'Suculentas y regalos vivos.' }
];

export const categoryName = (slug: ProductCategory) => categories.find(category => category.slug === slug)?.name || slug;
