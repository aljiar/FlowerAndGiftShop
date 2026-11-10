import Link from 'next/link';
import { MessageCircle, Clock, MapPin } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { site, whatsappLink } from '@/lib/constants';

export function Footer() {
  return <footer className="bg-forest text-cream mt-24">
    <Container className="py-16 md:py-20">
      <div className="grid md:grid-cols-3 gap-10">
        <div><Link href="/" className="font-serif text-3xl">{site.name}<span className="text-clay">·</span></Link>
          <p className="mt-4 text-sm text-cream/80">Flores y regalos para momentos especiales. Tienda 100% online en {site.city}.</p>
        </div>
        <div><h2 className="font-serif text-xl mb-4 text-cream">Explorar</h2><ul className="space-y-3 text-sm text-cream/80">
          <li><Link href="/coleccion">Catálogo</Link></li><li><Link href="/#ocasiones">Por ocasión</Link></li>
          <li><Link href="/nosotros">Nosotros</Link></li><li><Link href="/como-comprar">Cómo comprar</Link></li><li><Link href="/contacto">Contacto y horarios</Link></li>
        </ul></div>
        <div><h2 className="font-serif text-xl mb-4 text-cream">Atención</h2><ul className="space-y-3 text-sm text-cream/80">
          <li className="flex items-start gap-2"><MapPin size={16} className="shrink-0 mt-1" />{site.address}</li>
          <li><a href={whatsappLink('Hola, quiero consultar sobre Norah’s Garden.')} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2"><MessageCircle size={16} />{site.whatsapp}</a></li>
          <li className="flex items-start gap-2"><Clock size={16} className="shrink-0 mt-1" />{site.hours}</li>
          <li>QR o transferencia · coordinación manual</li>
        </ul></div>
      </div>
      <div className="border-t border-cream/20 mt-12 pt-6 flex flex-col md:flex-row justify-between gap-4 text-xs text-cream/80">
        <p>© {new Date().getFullYear()} {site.name}.</p><div className="flex flex-wrap gap-5"><Link href="/como-comprar#entregas">Entregas</Link><Link href="/como-comprar#condiciones">Políticas</Link><Link href="/como-comprar#pagos">Información de compra</Link></div>
      </div>
    </Container>
  </footer>;
}
