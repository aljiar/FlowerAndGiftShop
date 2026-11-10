import { MessageCircle, MapPin, CreditCard } from 'lucide-react';
import { Container } from '@/components/ui/Container';
const items = [
  { icon: MessageCircle, title: 'Atención por WhatsApp', text: 'Consulta disponibilidad y composición antes de confirmar.' },
  { icon: MapPin, title: 'Entrega a coordinar', text: 'Confirma cobertura, tarifa y fecha antes de pagar.' },
  { icon: CreditCard, title: 'QR o transferencia', text: 'Datos de pago por WhatsApp y verificación manual.' }
];
export function TrustBar() {
  return <section className="border-y border-line py-section"><Container>
    <h2 className="font-serif text-3xl mb-10">Cómo coordinamos tu regalo</h2>
    <div className="grid md:grid-cols-3 gap-8">{items.map(({ icon: Icon, title, text }) => <div key={title}>
      <Icon size={24} className="text-clay mb-4" /><h3 className="font-serif text-xl">{title}</h3><p className="text-sm text-muted mt-2">{text}</p>
    </div>)}</div>
  </Container></section>;
}
