import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { site } from '@/lib/constants';
import { Instagram, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-forest text-cream mt-24">
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" className="font-serif text-3xl text-cream">
              Pétalo<span className="text-clay">·</span>
            </Link>
            <p className="mt-4 text-sm text-cream/70 leading-relaxed max-w-sm">
              Florería de autor en {site.city}. Flores de corte, diseño contemporáneo
              y entrega el mismo día.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 inline-flex items-center justify-center rounded-full border border-cream/15 hover:bg-cream/10 transition-colors"
              >
                <Instagram size={16} strokeWidth={1.5} />
              </a>
              <a
                href={site.social.pinterest}
                target="_blank"
                rel="noreferrer"
                aria-label="Pinterest"
                className="w-9 h-9 inline-flex items-center justify-center rounded-full border border-cream/15 hover:bg-cream/10 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 21l4-9" />
                  <path d="M11 8c2 0 4 1 4 4s-2 4-4 4-3-1-3-3" />
                </svg>
              </a>
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 inline-flex items-center justify-center rounded-full border border-cream/15 hover:bg-cream/10 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow text-cream/60 mb-4">Tienda</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/coleccion" className="text-cream/80 hover:text-cream">Colección</Link></li>
              <li><Link href="/coleccion?occasion=cumpleanos" className="text-cream/80 hover:text-cream">Cumpleaños</Link></li>
              <li><Link href="/coleccion?occasion=amor" className="text-cream/80 hover:text-cream">Amor</Link></li>
              <li><Link href="/coleccion?occasion=condolencias" className="text-cream/80 hover:text-cream">Condolencias</Link></li>
              <li><Link href="/coleccion?occasion=corporativo" className="text-cream/80 hover:text-cream">Corporativo</Link></li>
              <li><Link href="/coleccion?priceMax=300" className="text-cream/80 hover:text-cream">Menos de Bs 300</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="eyebrow text-cream/60 mb-4">Atención</p>
            <ul className="space-y-3 text-sm text-cream/80">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-1 shrink-0 text-clay" strokeWidth={1.5} />
                <span>{site.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-clay shrink-0" strokeWidth={1.5} />
                <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="hover:text-cream">{site.phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle size={14} className="text-clay shrink-0" strokeWidth={1.5} />
                <a href={`https://wa.me/${site.whatsappRaw.replace('+', '')}`} className="hover:text-cream">{site.whatsapp}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-clay shrink-0" strokeWidth={1.5} />
                <a href={`mailto:${site.email}`} className="hover:text-cream">{site.email}</a>
              </li>
              <li className="pt-1 text-cream/60">{site.hours}</li>
            </ul>
          </div>
        </div>

        <div className="hairline mt-12 mb-6 bg-cream/15" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-cream/50">
          <p>© {new Date().getFullYear()} {site.name}. Todos los derechos reservados.</p>
          <div className="flex gap-5">
            <Link href="/contacto" className="hover:text-cream">Contacto</Link>
            <Link href="/contacto#politicas" className="hover:text-cream">Políticas</Link>
            <Link href="/contacto#terminos" className="hover:text-cream">Términos</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
