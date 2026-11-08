import type { MetadataRoute } from 'next';
import { site } from '@/lib/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/', '/checkout', '/carrito'] },
    sitemap: `${site.url}/sitemap.xml`
  };
}
