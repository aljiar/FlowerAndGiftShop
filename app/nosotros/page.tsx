import Image from 'next/image';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Leaf, Heart, Hand } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { site } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Nosotros',
  description: 'La historia de Pétalo, florería de autor en Cochabamba.'
};

export default function NosotrosPage() {
  return (
    <>
      <section className="bg-cream py-section md:py-section-md">
        <Container>
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-end">
            <div className="lg:col-span-7">
              <span className="eyebrow mb-4">Sobre Pétalo</span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-[1.04] tracking-editorial text-balance">
                Una florería que<br />
                <em className="italic text-clay">piensa antes de cortar</em>.
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-base md:text-lg text-muted leading-relaxed">
                Nacimos en {site.city} en {site.founded} con una idea simple: las flores son
                lenguaje. Por eso diseñamos cada arreglo como una pieza única, pensando
                quién la recibe y qué dice.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-cream">
        <Container>
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            <div className="relative aspect-[4/5] rounded-sm overflow-hidden bg-ivory">
              <Image
                src="https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=1200&q=80"
                alt="Taller de Pétalo"
                fill
                className="object-cover"
              />
            </div>
            <div className="grid grid-rows-3 gap-4 md:gap-6">
              <div className="relative rounded-sm overflow-hidden bg-ivory">
                <Image
                  src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=80"
                  alt="Detalle de un ramo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative rounded-sm overflow-hidden bg-ivory">
                <Image
                  src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80"
                  alt="Suculentas en taller"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative rounded-sm overflow-hidden bg-ivory">
                <Image
                  src="https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=900&q=80"
                  alt="Mesa con flores"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-ivory/40 py-section md:py-section-md">
        <Container className="max-w-3xl">
          <div className="prose-flow space-y-6 text-base md:text-lg text-forest/85 leading-relaxed">
            <p>
              Detrás de cada pedido hay una persona que pensó en otra persona. Esa cadena
              de atención es la que más nos importa. Por eso elegimos cada flor al
              mayorista de La Paz cada madrugada, sin intermediarios, y por eso nuestros
              arreglos no pasan más de 24 horas en cámara antes de salir.
            </p>
            <p>
              Trabajamos en equipo pequeño —cuatro manos— porque creemos que el diseño
              floral es un oficio que se aprende mirando. Lucía, la fundadora, se formó
              en talleres de Ciudad de México y Madrid antes de volver al valle.
            </p>
            <p>
              Hacemos entregas en {site.city} y los valles de Cochabamba, llegamos a
              oficinas, casas, clínicas y salones. Cuando alguien nos escribe por
              WhatsApp, respondemos en menos de 15 minutos.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-cream py-section">
        <Container>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: Leaf, title: 'Frescura honesta', text: 'Corte diario. Sin conservantes ni esponjas verdes.' },
              { icon: Hand, title: 'Hecho a mano', text: 'Cada arreglo se arma pieza por pieza en nuestro taller.' },
              { icon: Heart, title: 'Atención humana', text: 'Una persona real responde tu WhatsApp, no un bot.' }
            ].map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <div className="w-12 h-12 rounded-full bg-ivory inline-flex items-center justify-center text-forest mb-4">
                  <Icon size={18} strokeWidth={1.25} />
                </div>
                <h3 className="font-serif text-xl mb-2">{title}</h3>
                <p className="text-sm text-muted leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-forest text-cream py-section">
        <Container className="text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light tracking-editorial leading-tight text-balance max-w-2xl mx-auto">
            ¿Te gustaría que armemos algo juntas?
          </h2>
          <p className="mt-4 text-cream/70 max-w-md mx-auto">
            Para regalos del día, consúltanos por WhatsApp. Para bodas y eventos, agenda una consulta sin costo.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/eventos">
              <Button>Agenda una consulta <ArrowRight size={14} strokeWidth={1.5} /></Button>
            </Link>
            <Link href="/coleccion">
              <Button variant="secondary" className="border-cream/30 text-cream hover:border-cream hover:bg-cream/10">
                Ver colección
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
