import type { MetadataRoute } from 'next';
import { site, commerceReady } from '@/lib/constants';

export default function robots(): MetadataRoute.Robots {
  if (!commerceReady) return { rules: { userAgent: '*', disallow: '/' } };
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/', '/checkout', '/carrito'] },
    sitemap: `${site.url}/sitemap.xml`
  };
}
