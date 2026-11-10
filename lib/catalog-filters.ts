import type { FlowerTag, OccasionSlug, Product, ProductCategory, VariantSize } from '@/types';
import { categories } from './categories';

export const flowerLabels: Record<FlowerTag, string> = {
  rosas: 'Rosas', peonias: 'Peonías', tulipanes: 'Tulipanes', hortensias: 'Hortensias', girasoles: 'Girasoles',
  lilis: 'Lilis', lavanda: 'Lavanda', wildflowers: 'Silvestres', suculentas: 'Suculentas', exoticas: 'Exóticas'
};
export const occasionLabels: Record<OccasionSlug, string> = {
  cumpleanos: 'Cumpleaños', amor: 'Amor', agradecimientos: 'Agradecimientos', condolencias: 'Condolencias',
  nacimientos: 'Nacimientos', aniversario: 'Aniversario', corporativo: 'Corporativo'
};
export const sortOptions = [
  { value: 'relevancia', label: 'Destacados' }, { value: 'nuevos', label: 'Novedades' },
  { value: 'precio-asc', label: 'Menor precio' }, { value: 'precio-desc', label: 'Mayor precio' }
] as const;
export type SortKey = typeof sortOptions[number]['value'];
export interface FilterSelection {
  categories: ProductCategory[];
  flowers: FlowerTag[];
  occasions: OccasionSlug[];
  sizes: VariantSize[];
  priceMin: string;
  priceMax: string;
  sort: SortKey;
}
export const emptyFilters: FilterSelection = {
  categories: [], flowers: [], occasions: [], sizes: [], priceMin: '', priceMax: '', sort: 'relevancia'
};
const price = (value: string | null) => value !== null && value.trim() !== '' && Number.isFinite(Number(value)) && Number(value) >= 0 ? String(Number(value)) : '';
const values = <T extends string>(params: URLSearchParams, key: string, allowed: readonly T[]): T[] =>
  Array.from(new Set(params.getAll(key).filter((value): value is T => allowed.includes(value as T))));

export function readFilters(params: URLSearchParams): FilterSelection {
  const sort = params.get('sort');
  return {
    categories: values(params, 'category', categories.map(category => category.slug)),
    flowers: values(params, 'flower', Object.keys(flowerLabels) as FlowerTag[]),
    occasions: values(params, 'occasion', Object.keys(occasionLabels) as OccasionSlug[]),
    sizes: values(params, 'size', ['S', 'M', 'L', 'XL'] as const),
    priceMin: price(params.get('priceMin')), priceMax: price(params.get('priceMax')),
    sort: sortOptions.some(option => option.value === sort) ? sort as SortKey : 'relevancia'
  };
}

export function filterQuery(filters: FilterSelection): string {
  const params = new URLSearchParams();
  for (const [key, list] of [['category', filters.categories], ['flower', filters.flowers], ['occasion', filters.occasions], ['size', filters.sizes]] as const) {
    list.forEach(value => params.append(key, value));
  }
  if (price(filters.priceMin)) params.set('priceMin', price(filters.priceMin));
  if (price(filters.priceMax)) params.set('priceMax', price(filters.priceMax));
  if (filters.sort !== 'relevancia') params.set('sort', filters.sort);
  return params.toString();
}

export function matchingVariants(product: Product, filters: FilterSelection) {
  return product.variants.filter(variant => {
    const amount = product.basePrice + variant.priceDelta;
    return (!filters.sizes.length || filters.sizes.includes(variant.size)) &&
      (filters.priceMin === '' || amount >= Number(filters.priceMin)) &&
      (filters.priceMax === '' || amount <= Number(filters.priceMax));
  });
}

export function filterProducts(products: Product[], filters: FilterSelection): Product[] {
  const list = products.filter(product =>
    (!filters.categories.length || filters.categories.includes(product.category)) &&
    (!filters.flowers.length || product.flowers.some(flower => filters.flowers.includes(flower))) &&
    (!filters.occasions.length || product.occasions.some(occasion => filters.occasions.includes(occasion))) &&
    matchingVariants(product, filters).length > 0
  );
  const min = (product: Product) => Math.min(...matchingVariants(product, filters).map(variant => product.basePrice + variant.priceDelta));
  if (filters.sort === 'precio-asc') list.sort((a, b) => min(a) - min(b));
  if (filters.sort === 'precio-desc') list.sort((a, b) => min(b) - min(a));
  if (filters.sort === 'nuevos') list.sort((a, b) => Number(b.tags.includes('nuevo')) - Number(a.tags.includes('nuevo')));
  return list;
}
