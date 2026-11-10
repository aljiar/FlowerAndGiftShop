'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { useModal } from '@/lib/useModal';
import { X, ArrowRight } from 'lucide-react';
import { navLinks, site } from '@/lib/constants';
import { occasions } from '@/lib/occasions';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  useModal(open, onClose, panel);
  if (!open) return null;

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className="absolute inset-0 bg-forest/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        tabIndex={-1}
        className={`absolute inset-y-0 left-0 w-[88%] max-w-sm bg-cream shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-line">
          <span className="font-serif text-2xl text-forest">
            {site.name}<span className="text-clay">·</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-forest"
            aria-label="Cerrar menú"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-6 space-y-7" aria-label="Menú móvil">
          <ul className="space-y-3">
            {navLinks.map((l) => (
              <li key={l.href + l.label}>
                <Link
                  href={l.href}
                  onClick={onClose}
                  className="font-serif text-2xl text-forest hover:text-clay transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div>
            <p className="eyebrow mb-3">Por ocasión</p>
            <ul className="grid grid-cols-2 gap-2">
              {occasions.map((o) => (
                <li key={o.slug}>
                  <Link
                    href={`/ocasion/${o.slug}`}
                    onClick={onClose}
                    className="block text-sm py-1.5 text-forest/80 hover:text-clay"
                  >
                    {o.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-line space-y-2 text-sm text-muted">
            <p>{site.hours}</p>

          </div>
        </nav>

        <div className="px-5 py-5 border-t border-line">
          <Link
            href="/coleccion"
            onClick={onClose}
            className="flex items-center justify-between text-sm font-medium uppercase tracking-wider text-cream bg-clay hover:bg-clay-hover rounded-sm px-5 h-11"
          >
            Explorar catálogo <ArrowRight size={16} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </div>
  );
}
