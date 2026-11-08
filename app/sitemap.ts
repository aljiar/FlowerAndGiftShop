import type { MetadataRoute } from 'next';
import { site } from '@/lib/constants';
import { products } from '@/lib/catalog';
import { occasions } from '@/lib/occasions';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = site.url;
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/coleccion`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/eventos`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/nosotros`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contacto`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    ...occasions.map((o) => ({
      url: `${base}/ocasion/${o.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7
    })),
    ...products.map((p) => ({
      url: `${base}/producto/${p.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8
    }))
  ];
}
