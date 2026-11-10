import { CategoryGrid } from '@/components/home/CategoryGrid';
import { Hero } from '@/components/home/Hero';
import { IntentGrid } from '@/components/home/IntentGrid';
import { FeaturedGrid } from '@/components/home/FeaturedGrid';
import { TrustBar } from '@/components/home/TrustBar';
import { EventsTeaser } from '@/components/home/EventsTeaser';

import { JsonLd } from '@/components/seo/JsonLd';
import { site, commerceReady } from '@/lib/constants';

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <IntentGrid />
      <FeaturedGrid />
      <TrustBar />
      <EventsTeaser />

      {commerceReady && <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Florist',
          name: site.name,
          description: site.description,
          url: site.url,
          telephone: site.whatsapp,
          areaServed: site.city,
          sameAs: Object.values(site.social).filter(Boolean)
        }}
      />}
    </>
  );
}
