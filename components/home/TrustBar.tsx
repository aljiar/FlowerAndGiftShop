import { Truck, Camera, ShieldCheck, Flower2, MessageCircle, Clock } from 'lucide-react';
import { Container } from '@/components/ui/Container';

const items = [
  {
    icon: Truck,
    title: 'Entrega hoy',
    text: 'Pedidos antes de las 14:00 llegan en 2 a 4 horas.'
  },
  {
    icon: Camera,
    title: 'Foto de confirmación',
    text: 'Te enviamos una foto del arreglo antes de salir.'
  },
  {
    icon: ShieldCheck,
    title: 'Pago seguro',
    text: 'Tarjeta, transferencia o QR. Datos protegidos.'
  },
  {
    icon: Flower2,
    title: 'Flores frescas',
    text: 'Corte diario directo del mayorista de La Paz.'
  },
  {
    icon: MessageCircle,
    title: 'Atención por WhatsApp',
    text: 'Respuesta en menos de 15 minutos, de 9 a 20 h.'
  },
  {
    icon: Clock,
    title: 'Cambios sin costo',
    text: '¿No acertaste? Cambiamos el arreglo en 24 h.'
  }
];

export function TrustBar() {
  return (
    <section className="bg-cream py-section md:py-section-md border-y border-line">
      <Container>
        <div className="text-center mb-12 md:mb-16">
          <span className="eyebrow mb-4 inline-flex">Cómo trabajamos</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light tracking-editorial max-w-2xl mx-auto leading-tight text-balance">
            Cuidamos cada detalle, desde el corte hasta la entrega.
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {items.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex flex-col items-start gap-3 group">
              <div className="w-11 h-11 rounded-full bg-ivory inline-flex items-center justify-center text-forest group-hover:bg-clay group-hover:text-cream transition-colors duration-300">
                <Icon size={18} strokeWidth={1.25} />
              </div>
              <div>
                <p className="font-serif text-base text-forest">{title}</p>
                <p className="text-xs text-muted mt-1 leading-relaxed">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
