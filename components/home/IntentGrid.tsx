import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { occasions } from '@/lib/occasions';
import { formatPriceShort } from '@/lib/format';

export function IntentGrid() {
  const cards = [
    ...occasions,
    {
      _id: 'o-budget',
      slug: 'menos-de-300' as const,
      name: 'Menos de Bs 300',
      blurb: 'Detalles hermosos a precio accesible.',
      coverImage:
        'https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=1200&q=80',
      coverAlt: 'Arreglos accesibles',
      startingPrice: 140
    }
  ];

  return (
    <section className="bg-cream py-section md:py-section-md">
      <Container>
        <div className="flex items-end justify-between gap-6 mb-10 md:mb-14">
          <SectionTitle
            eyebrow="Encuentra por intención"
            title="¿Qué quieres decir hoy?"
            description="Empieza por la ocasión. Cada colección está curada con una intención clara y un rango de precio honesto."
          />
          <Link
            href="/coleccion"
            className="hidden md:inline-flex items-center gap-1 text-sm text-forest hover:text-clay whitespace-nowrap pb-1"
          >
            Ver colección completa <ArrowUpRight size={14} strokeWidth={1.5} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
          {cards.map((c, i) => (
            <Link
              key={c.slug}
              href={c.slug === 'menos-de-300' ? '/coleccion?priceMax=300' : `/ocasion/${c.slug}`}
              className="group relative block aspect-[3/4] rounded-sm overflow-hidden bg-ivory animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <Image
                src={c.coverImage}
                alt={c.coverAlt}
                fill
                sizes="(min-width: 1024px) 17vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/70 via-forest/10 to-transparent transition-opacity duration-300 group-hover:from-forest/80" />
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 text-cream">
                <p className="font-serif text-lg md:text-xl leading-tight">{c.name}</p>
                <p className="text-[10px] md:text-xs uppercase tracking-wider text-cream/70 mt-1">
                  Desde {formatPriceShort(c.startingPrice)}
                </p>
              </div>
              <div className="absolute top-3 right-3 w-8 h-8 inline-flex items-center justify-center rounded-full bg-cream/90 backdrop-blur text-forest opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                <ArrowUpRight size={14} strokeWidth={1.5} />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
