import { Hero } from '@/components/home/Hero';
import { IntentGrid } from '@/components/home/IntentGrid';
import { FeaturedGrid } from '@/components/home/FeaturedGrid';
import { TrustBar } from '@/components/home/TrustBar';
import { EventsTeaser } from '@/components/home/EventsTeaser';
import { Reviews } from '@/components/home/Reviews';
import { JsonLd } from '@/components/seo/JsonLd';
import { site } from '@/lib/constants';

export default function HomePage() {
  return (
    <>
      <Hero />
      <IntentGrid />
      <FeaturedGrid />
      <TrustBar />
      <EventsTeaser />
      <Reviews />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Florist',
          name: site.name,
          description: site.description,
          url: site.url,
          telephone: site.phone,
          email: site.email,
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Av. Ballivián #745, Cala Cala',
            addressLocality: site.city,
            addressCountry: 'BO'
          },
          openingHours: 'Mo-Sa 09:00-20:00',
          priceRange: 'Bs 120 – Bs 1200',
          sameAs: Object.values(site.social)
        }}
      />
    </>
  );
}
