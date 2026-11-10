'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ShoppingBag, Menu } from 'lucide-react';
import { navLinks, site } from '@/lib/constants';
import { useCartStore } from '@/lib/store/useCartStore';
import { MobileMenu } from './MobileMenu';
import { cn } from '@/lib/cva';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const hydrated = useCartStore((s) => s.hydrated);
  const count = useCartStore((s) => s.count());
  const openCart = useCartStore((s) => s.open);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const closeOnDesktop = () => { if (desktop.matches) setMobileOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 transition-all duration-300 border-b',
          scrolled
            ? 'bg-cream/85 backdrop-blur-md border-line/80'
            : 'bg-cream border-transparent'
        )}
      >
        <div className="container flex items-center justify-between h-16 md:h-20 gap-2">
          <button
            type="button"
            className="lg:hidden -ml-1 w-11 h-11 inline-flex items-center justify-center text-forest"
            aria-label="Abrir menú"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>

          <Link
            href="/"
            className="font-serif text-2xl md:text-3xl tracking-editorial text-forest leading-none whitespace-nowrap"
            aria-label={`${site.name} · inicio`}
          >
            {site.name}
            <span className="text-clay">·</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-5" aria-label="Principal">
            {navLinks.map((l) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                className="text-sm text-forest/80 hover:text-forest transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 md:gap-2">
            <button
              type="button"
              onClick={openCart}
              className="relative w-11 h-11 inline-flex items-center justify-center text-forest/80 hover:text-forest transition-colors"
              aria-label={`Carrito (${hydrated ? count : 0} productos)`}
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {hydrated && count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-forest text-cream text-[10px] leading-none w-4 h-4 flex items-center justify-center rounded-full font-medium">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
