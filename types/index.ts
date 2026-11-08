export type FlowerTag =
  | 'rosas'
  | 'peonias'
  | 'tulipanes'
  | 'hortensias'
  | 'girasoles'
  | 'lilis'
  | 'lavanda'
  | 'wildflowers'
  | 'suculentas'
  | 'exoticas';

export type OccasionSlug =
  | 'cumpleanos'
  | 'amor'
  | 'agradecimientos'
  | 'condolencias'
  | 'nacimientos'
  | 'aniversario'
  | 'corporativo';

export type ProductTag = 'nuevo' | 'best' | 'edicion-limitada' | 'sale';

export type VariantSize = 'S' | 'M' | 'L' | 'XL';

export interface ProductVariant {
  id: string;
  size: VariantSize;
  label: string;
  priceDelta: number;
}

export interface ProductImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface Product {
  _id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  basePrice: number;
  compareAtPrice?: number;
  images: ProductImage[];
  flowers: FlowerTag[];
  occasions: OccasionSlug[];
  variants: ProductVariant[];
  inStock: boolean;
  tags: ProductTag[];
  highlights?: string[];
  care?: string;
}

export interface Occasion {
  _id: string;
  slug: OccasionSlug;
  name: string;
  blurb: string;
  coverImage: string;
  coverAlt: string;
  startingPrice: number;
}

export interface Review {
  _id: string;
  name: string;
  rating: 4 | 5;
  text: string;
  occasion: OccasionSlug | 'otro';
  city: string;
  date: string; // ISO
  avatarUrl?: string;
}

export interface EventStory {
  _id: string;
  title: string;
  type: 'boda' | 'corporativo' | 'celebracion';
  image: string;
  alt: string;
  caption: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  eta: string;
  fee: number;
  freeFrom: number;
}

export interface TimeSlot {
  id: string;
  label: string;
  start: string; // HH:mm
  end: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  qty: number;
  message?: string;
  recipient?: {
    name?: string;
    phone?: string;
    address?: string;
    zoneId?: string;
  };
  delivery?: {
    date: string; // ISO
    slotId: string;
  };
}

export interface CatalogFilters {
  flowers?: FlowerTag[];
  occasions?: OccasionSlug[];
  sizes?: VariantSize[];
  priceMin?: number;
  priceMax?: number;
  sort?: 'relevancia' | 'precio-asc' | 'precio-desc' | 'nuevos';
}
