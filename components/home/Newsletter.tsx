'use client';

import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Input } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setDone(true);
    setTimeout(() => {
      setDone(false);
      setEmail('');
    }, 3500);
  };

  return (
    <section className="bg-cream py-section md:py-section-md">
      <Container className="max-w-3xl">
        <div className="text-center">
          <span className="eyebrow mb-4 inline-flex">Boletín</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light tracking-editorial leading-tight text-balance">
            Una flor, un domingo al mes.
          </h2>
          <p className="mt-4 text-muted max-w-md mx-auto text-pretty leading-relaxed">
            Un correo breve al mes con una flor de temporada, un arreglo recomendado
            y un descuento exclusivo para suscriptoras.
          </p>
        </div>

        <form onSubmit={submit} className="mt-8 max-w-md mx-auto">
          {done ? (
            <div className="flex items-center justify-center gap-2 py-3 text-sage">
              <Check size={16} strokeWidth={1.5} />
              <span className="text-sm">¡Gracias! Te escribimos pronto.</span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Correo electrónico"
                required
                className="flex-1"
              />
              <Button type="submit" size="md">
                Suscribirme <ArrowRight size={14} strokeWidth={1.5} />
              </Button>
            </div>
          )}
          <p className="text-[11px] text-muted mt-3 text-center">
            Sin spam. Puedes darte de baja cuando quieras.
          </p>
        </form>
      </Container>
    </section>
  );
}
