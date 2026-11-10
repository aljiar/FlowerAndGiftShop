import type { Metadata } from 'next';
import { MessageCircle, Clock, MapPin } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { site, commerceReady, whatsappLink } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Contacto y cómo comprar',
  description: 'Consulta por WhatsApp con Norah’s Garden. Flores y regalos en Cochabamba.'
};

export default function ContactoPage() {
  return <section className="bg-cream py-section">
    <Container className="max-w-4xl">
      <span className="eyebrow mb-4">Contacto y cómo comprar</span>
      <h1 className="font-serif text-4xl md:text-5xl">Conversemos sobre tu regalo.</h1>
      <p className="mt-6 text-muted max-w-2xl">Somos una tienda 100% online en Cochabamba. Escríbenos para consultar opciones y coordinar los detalles antes de realizar un pago.</p>
      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <a href={whatsappLink('Hola, quiero consultar sobre flores y regalos de Norah’s Garden.')} target="_blank" rel="noreferrer" className="block border border-line rounded-sm p-6 hover:border-forest">
          <MessageCircle className="text-clay" size={24} />
          <h2 className="font-serif text-xl mt-4">Escribir por WhatsApp</h2>
          <p className="mt-2">{site.whatsapp}</p>
          <p className="text-sm text-muted mt-2">Abrirás una conversación; envía tu mensaje para que podamos atenderte.</p>
        </a>
        <div className="border border-line rounded-sm p-6">
          <Clock className="text-clay" size={24} />
          <h2 className="font-serif text-xl mt-4">Horario de atención</h2>
          <p className="mt-2 text-sm">{site.hours}</p>
          <p className="text-sm text-muted mt-2">Si escribes fuera de horario, atenderemos tu consulta al retomar la atención.</p>
        </div>
      </div>
      <div className="mt-12 space-y-8">
        <div><h2 className="font-serif text-2xl mb-4">Cómo comprar</h2>
          {!commerceReady && <p className="text-sm text-muted mb-4">El catálogo actual es de ejemplo: sus fotos y precios son de referencia. Los pedidos en la web aún no están habilitados.</p>}
          <ol className="list-decimal pl-5 space-y-3 text-sm">
            <li>Cuéntanos por WhatsApp qué regalo buscas y para qué fecha.</li>
            <li>Consulta disponibilidad, composición, precio y condiciones de entrega. Acordaremos el importe total antes del pago.</li>
            <li>Recibe los datos de QR o transferencia por WhatsApp. El pago se verifica manualmente.</li>
            <li>Coordina la confirmación y la entrega con nuestro equipo.</li>
          </ol>
        </div>
        <div id="entregas" className="scroll-mt-28"><h2 className="font-serif text-2xl mb-3 flex items-center gap-2"><MapPin size={20} /> Entregas en Cochabamba</h2>
          <p className="text-sm text-muted">Las zonas de cobertura, tarifas y plazos están por definir. Consulta tu dirección y fecha por WhatsApp antes de pagar; no se garantiza entrega el mismo día.</p>
        </div>
        <div id="politicas" className="scroll-mt-28"><h2 className="font-serif text-2xl mb-3">Cambios y cancelaciones</h2>
          <p className="text-sm text-muted">Las condiciones están en preparación. Solicítalas antes de confirmar una compra. No se anuncian cambios gratuitos ni plazos de cancelación hasta que estén definidos.</p>
        </div>
        <div id="terminos" className="scroll-mt-28"><h2 className="font-serif text-2xl mb-3">Información de compra</h2>
          <p className="text-sm text-muted">Elige QR o transferencia, coordinados manualmente por WhatsApp. Esta web no procesa tarjetas ni cobra automáticamente. Consultar o agregar productos al carrito no confirma una compra ni reserva disponibilidad.</p>
        </div>
      </div>
    </Container>
  </section>;
}
