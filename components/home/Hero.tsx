import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { site } from '@/lib/constants';
import { HeroCutStatus } from './HeroCutStatus';

export function Hero() {
  return (
    <section className="relative bg-cream">
      <Container className="pt-8 md:pt-12 pb-12 md:pb-16">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-5 lg:pb-12 animate-fade-up">
            <span className="eyebrow mb-6">Florería de autor · desde 2019</span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-[1.02] tracking-editorial text-balance">
              Flores que llegan<br />
              con <em className="italic text-clay">intención</em>.
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted max-w-md leading-relaxed">
              Arreglos hechos a mano en nuestro taller de {site.city}, con flores
              frescas y entrega programada en {site.city}. Elige tu arreglo y coordina el pago por WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/coleccion">
                <Button size="lg">Enviar flores hoy <ArrowRight size={16} strokeWidth={1.5} /></Button>
              </Link>
              <Link href="/eventos">
                <Button size="lg" variant="secondary">Diseño floral para eventos</Button>
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-6 text-xs text-muted">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
                <HeroCutStatus />
              </div>
              <div className="hidden sm:block w-px h-3 bg-line" />
              <span className="hidden sm:inline">{site.hours}</span>
            </div>
          </div>

          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[4/5] md:aspect-[5/4] lg:aspect-[4/5] rounded-sm overflow-hidden bg-ivory">
              <Image
                src="https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=1600&q=80"
                alt="Bouquet editorial de rosas y peonías sobre mesa"
                fill
                priority
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/10 via-transparent to-transparent" />
            </div>
            <figure className="absolute -bottom-6 -left-2 md:-left-6 bg-cream shadow-soft rounded-sm px-4 py-3 max-w-[220px] hidden sm:block">
              <blockquote className="font-serif text-sm italic leading-snug text-forest">
                "Cada ramo se arma como si fuera para alguien de la casa."
              </blockquote>
              <figcaption className="text-[10px] uppercase tracking-wider text-muted mt-2">
                Lucía Mendieta · fundadora
              </figcaption>
            </figure>
          </div>
        </div>
      </Container>
    </section>
  );
}
