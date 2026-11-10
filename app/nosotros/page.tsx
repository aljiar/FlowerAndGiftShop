import Link from 'next/link';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { site, whatsappLink } from '@/lib/constants';

export const metadata: Metadata = { title: 'Nosotros', description: 'Conoce Norah’s Garden, una tienda online de flores y regalos en Cochabamba.' };

export default function NosotrosPage() {
  return <section className="bg-cream py-section md:py-section-md">
    <Container className="max-w-3xl">
      <span className="eyebrow mb-4">Sobre {site.name}</span>
      <h1 className="font-serif text-4xl md:text-5xl text-balance">Detalles para tus momentos especiales.</h1>
      <div className="mt-8 space-y-5 text-base text-muted leading-relaxed">
        <p>{site.name} es un proyecto de tienda 100% online de flores y regalos en Cochabamba.</p>
        <p>Estamos preparando una propuesta que combina flores naturales, flores eternas, globos y peluches, con productos de elaboración propia y de proveedores.</p>
        <p>El catálogo que ves actualmente es una muestra de la experiencia de la tienda. Consulta por WhatsApp las opciones disponibles, sus precios y las condiciones de entrega antes de realizar un pago.</p>
      </div>
      <div className="mt-8 grid sm:grid-cols-2 gap-4"><div className="border border-line rounded-lg p-5"><h2 className="font-serif text-xl mb-3">Una propuesta mixta</h2><p className="text-sm text-muted">Combinamos la preparación de productos propios y artículos de proveedores según la opción elegida. Consulta la composición y qué incluye cada regalo.</p></div><div className="border border-line rounded-lg p-5"><h2 className="font-serif text-xl mb-3">Atención online</h2><p className="text-sm text-muted">{site.hours}. Escríbenos al {site.whatsapp} para revisar disponibilidad y entrega.</p></div></div>
      <Link href="/como-comprar" className="flex min-h-11 items-center underline text-sm mt-5">Conoce cómo comprar y qué confirmar antes del pago</Link>
      <a href={whatsappLink('Hola, quisiera conocer más sobre Norah’s Garden.')} target="_blank" rel="noreferrer" className="inline-flex mt-8 bg-forest text-cream rounded-sm px-6 py-4 text-sm">Conversemos por WhatsApp</a>
    </Container>
  </section>;
}
