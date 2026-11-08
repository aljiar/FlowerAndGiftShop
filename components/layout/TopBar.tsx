import Link from 'next/link';
import { Truck, MapPin } from 'lucide-react';
import { site } from '@/lib/constants';

export function TopBar() {
  return (
    <div className="bg-forest text-cream text-xs">
      <div className="container flex items-center justify-between py-2.5 gap-4">
        <div className="hidden sm:flex items-center gap-2 text-cream/80">
          <Truck size={13} strokeWidth={1.5} />
          <span className="tracking-wide">
            Entregas programadas en <strong className="font-medium text-cream">{site.city}</strong>
          </span>
        </div>
        <div className="sm:hidden flex items-center gap-2 text-cream/80">
          <Truck size={12} strokeWidth={1.5} />
          <span>Entregas en {site.city}</span>
        </div>
        <Link
          href="/contacto"
          className="hidden md:flex items-center gap-2 text-cream/70 hover:text-cream transition-colors"
        >
          <MapPin size={13} strokeWidth={1.5} />
          <span>Cobertura y zonas</span>
        </Link>
      </div>
    </div>
  );
}
