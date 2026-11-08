import type { Metadata } from 'next';
import { MapPin, Phone, Mail, MessageCircle, Clock, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Input, Textarea, Select } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { site, deliveryZones } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Atención por WhatsApp, correo y formulario. Zonas de delivery y horarios de Pétalo.'
};

export default function ContactoPage() {
  return (
    <>
      <section className="bg-cream py-section">
        <Container>
          <div className="max-w-2xl">
            <span className="eyebrow mb-4">Contacto</span>
            <h1 className="font-serif text-4xl md:text-5xl tracking-editorial leading-[1.04] text-balance">
              Estamos para ayudarte,<br />
              <em className="italic text-clay">sin vueltas</em>.
            </h1>
            <p className="mt-6 text-muted text-base md:text-lg leading-relaxed">
              Respondemos en menos de 15 minutos entre las 9 y las 20 h. Para consultas
              urgentes fuera de horario, escríbenos por WhatsApp.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-cream pb-section">
        <Container>
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: MessageCircle,
                title: 'WhatsApp',
                line: site.whatsapp,
                href: `https://wa.me/${site.whatsappRaw.replace('+', '')}`,
                text: 'Lunes a sábado · 9 a 20 h'
              },
              {
                icon: Phone,
                title: 'Teléfono',
                line: site.phone,
                href: `tel:${site.phone.replace(/\s/g, '')}`,
                text: 'Para empresas y eventos'
              },
              {
                icon: Mail,
                title: 'Correo',
                line: site.email,
                href: `mailto:${site.email}`,
                text: 'Te respondemos en 24 h'
              }
            ].map(({ icon: Icon, title, line, href, text }) => (
              <a
                key={title}
                href={href}
                className="group block border border-line rounded-sm p-6 hover:border-forest transition-colors bg-cream"
              >
                <div className="w-10 h-10 rounded-full bg-ivory flex items-center justify-center text-forest group-hover:bg-clay group-hover:text-cream transition-colors">
                  <Icon size={16} strokeWidth={1.5} />
                </div>
                <p className="font-serif text-lg mt-4">{title}</p>
                <p className="text-sm text-forest mt-1">{line}</p>
                <p className="text-xs text-muted mt-2">{text}</p>
              </a>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-ivory/40 py-section">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-serif text-3xl mb-2">Envíanos un mensaje</h2>
              <p className="text-sm text-muted mb-6">
                Para consultas generales, presupuestos o comentarios.
              </p>
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input label="Nombre" name="name" required placeholder="Tu nombre" />
                  <Input label="Teléfono" name="phone" type="tel" placeholder="+591 7XXXXXXX" />
                </div>
                <Input label="Correo" name="email" type="email" required />
                <Select label="Motivo" name="reason">
                  <option>Consulta general</option>
                  <option>Pedido en curso</option>
                  <option>Evento / boda</option>
                  <option>Regalo corporativo</option>
                </Select>
                <Textarea label="Mensaje" name="message" rows={5} />
                <Button type="submit">Enviar mensaje</Button>
              </form>
            </div>

            <div className="space-y-8">
              <div>
                <p className="eyebrow mb-3">Dónde estamos</p>
                <p className="flex items-start gap-3 text-sm">
                  <MapPin size={16} className="mt-0.5 text-clay shrink-0" strokeWidth={1.5} />
                  <span>{site.address}</span>
                </p>
                <p className="flex items-center gap-3 text-sm mt-3">
                  <Clock size={16} className="text-clay shrink-0" strokeWidth={1.5} />
                  {site.hours}
                </p>
                <p className="flex items-center gap-3 text-sm mt-3">
                  <ShieldCheck size={16} className="text-clay shrink-0" strokeWidth={1.5} />
                  Pagos seguros · Foto de confirmación
                </p>
              </div>

              <div>
                <p className="eyebrow mb-3" id="politicas">Zonas de entrega</p>
                <ul className="divide-y divide-line border-y border-line">
                  {deliveryZones.map((z) => (
                    <li key={z.id} className="py-3 flex items-center justify-between text-sm">
                      <div>
                        <p className="text-forest">{z.name}</p>
                        <p className="text-xs text-muted">Llega en {z.eta}</p>
                      </div>
                      <p className="text-xs text-muted">
                        Desde {z.fee} BOB · gratis sobre {z.freeFrom}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div id="terminos">
                <p className="eyebrow mb-3">Políticas</p>
                <ul className="text-sm text-muted space-y-2">
                  <li>• Cambios sin costo dentro de las 24 h posteriores a la entrega.</li>
                  <li>• Cancelaciones aceptadas hasta 4 h antes de la franja programada.</li>
                  <li>• Para eventos corporativos emitimos factura.</li>
                  <li>• No repartimos los domingos. En días feriados, consultar.</li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
