import Image from 'next/image';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { EventInquiryForm } from '@/components/events/EventInquiryForm';
import { eventStories } from '@/lib/events';

export const metadata: Metadata = {
  title: 'Eventos',
  description:
    'Diseño floral para bodas, eventos corporativos y celebraciones en Cochabamba. Consulta sin costo.'
};

export default function EventosPage() {
  return (
    <>
      <section className="bg-cream py-section">
        <Container className="max-w-4xl text-center">
          <span className="eyebrow mb-4 inline-flex">Eventos</span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-[1.04] tracking-editorial text-balance">
            Diseño floral para<br />
            <em className="italic text-clay">momentos que importan</em>.
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted max-w-prose mx-auto leading-relaxed">
            Trabajamos con novias, familias y equipos corporativos en Cochabamba y los valles.
            Hacemos una primera conversación sin costo, luego una propuesta con moodboard
            y cerramos con un montaje cuidado el día del evento.
          </p>
        </Container>
      </section>

      <section className="bg-cream pb-section">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {eventStories.map((story, i) => (
              <figure
                key={story._id}
                className={`relative rounded-sm overflow-hidden bg-ivory group ${
                  i === 0 ? 'col-span-2 row-span-2 aspect-[4/5]' : 'aspect-square'
                }`}
              >
                <Image
                  src={story.image}
                  alt={story.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-[1.04]"
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-4 text-cream bg-gradient-to-t from-forest/85 via-forest/20 to-transparent">
                  <p className="text-[10px] uppercase tracking-wider text-cream/80">{story.type}</p>
                  <p className="font-serif text-base md:text-lg mt-1 leading-tight">{story.title}</p>
                  {i === 0 && (
                    <p className="hidden md:block text-xs text-cream/70 mt-2 max-w-md">{story.caption}</p>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-ivory/40 py-section">
        <Container className="max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <span className="eyebrow mb-3">Cómo trabajamos</span>
              <h2 className="font-serif text-3xl md:text-4xl tracking-editorial leading-tight mb-5">
                Tres pasos, sin sorpresas.
              </h2>
              <ol className="space-y-5 text-sm">
                <li className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-forest text-cream inline-flex items-center justify-center font-serif shrink-0">1</span>
                  <div>
                    <p className="font-serif text-base text-forest">Conversación inicial</p>
                    <p className="text-muted mt-1">Charlamos por WhatsApp o videollamada sobre tu visión, fecha, lugar y presupuesto.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-forest text-cream inline-flex items-center justify-center font-serif shrink-0">2</span>
                  <div>
                    <p className="font-serif text-base text-forest">Propuesta moodboard</p>
                    <p className="text-muted mt-1">Te enviamos una propuesta visual con flores, paleta y referencias en 48 h.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-forest text-cream inline-flex items-center justify-center font-serif shrink-0">3</span>
                  <div>
                    <p className="font-serif text-base text-forest">Montaje el día del evento</p>
                    <p className="text-muted mt-1">Nuestro equipo llega con anticipación, instala y se retira sin dejar rastro.</p>
                  </div>
                </li>
              </ol>
            </div>

            <div>
              <h3 className="font-serif text-2xl mb-4">Agenda una consulta</h3>
              <EventInquiryForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
