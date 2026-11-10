import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { eventStories } from '@/lib/events';

export function EventsTeaser() {
  const featured = eventStories.slice(0, 4);

  return (
    <section className="bg-cream py-section md:py-section-md">
      <Container>
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5 lg:sticky lg:top-28 self-start">
            <SectionTitle
              eyebrow="Eventos"
              title="Ideas florales para una ocasión especial."
              description="Referencias visuales para conversar sobre tus ideas. Estas imágenes no representan eventos realizados por Norah’s Garden. Consulta el alcance y la disponibilidad del servicio."
            />
            <ul className="mt-8 space-y-3 text-sm text-forest/80">
              {[
                'Disponibilidad a consultar',
                'Propuesta sujeta a confirmación',
                'Servicios y costos a acordar'
              ].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full border border-clay/40 flex items-center justify-center text-clay text-xs">✓</span>
                  {t}
                </li>
              ))}
            </ul>
            <Link
              href="/eventos"
              className="mt-8 inline-flex items-center gap-2 bg-forest text-cream text-xs uppercase tracking-wider px-6 h-11 rounded-sm hover:bg-forest-soft"
            >
              Consultar una idea <ArrowUpRight size={14} strokeWidth={1.5} />
            </Link>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-3 md:gap-4">
            {featured.map((story, i) => (
              <figure
                key={story._id}
                className={`relative rounded-sm overflow-hidden bg-ivory group ${
                  i % 3 === 0 ? 'row-span-2 aspect-[3/4]' : 'aspect-square'
                }`}
              >
                <Image
                  src={story.image}
                  alt={story.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, 50vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-[1.05]"
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-4 text-cream bg-gradient-to-t from-forest/80 via-forest/20 to-transparent">
                  <p className="text-[10px] uppercase tracking-wider text-cream/80">{story.type}</p>
                  <p className="font-serif text-base md:text-lg mt-1 leading-tight">{story.title}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
