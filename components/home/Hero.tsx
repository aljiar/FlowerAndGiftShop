import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { site } from '@/lib/constants';


export function Hero() {
  return (
    <section className="relative bg-cream">
      <Container className="pt-8 md:pt-12 pb-12 md:pb-16">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-5 lg:pb-12 animate-fade-up">
            <span className="eyebrow mb-6">Flores y regalos · Cochabamba</span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-[1.02] tracking-editorial text-balance">
              Flores que llegan<br />
              con <em className="italic text-clay">intención</em>.
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted max-w-md leading-relaxed">
              Estamos preparando nuestra tienda online de flores y regalos en {site.city}. Explora el catálogo de ejemplo y consulta opciones por WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/coleccion">
                <Button size="lg">Explorar catálogo <ArrowRight size={16} strokeWidth={1.5} /></Button>
              </Link>
              <Link href="/eventos">
                <Button size="lg" variant="secondary">Diseño floral para eventos</Button>
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-6 text-xs text-muted">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
                Atención por WhatsApp
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
            <p className="text-xs text-muted mt-3">Fotografía de referencia.</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
