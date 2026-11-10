import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { ProductCard } from '@/components/product/ProductCard';
import { occasionBySlug } from '@/lib/occasions';
import { getProductsByOccasion } from '@/lib/catalog';
import { formatPriceShort } from '@/lib/format';
import { occasions } from '@/lib/occasions';

export function generateStaticParams() {
  return occasions.map((o) => ({ slug: o.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const occ = occasionBySlug(params.slug);
  if (!occ) return { title: 'Ocasión no encontrada' };
  return {
    title: `Arreglos para ${occ.name}`,
    description: occ.blurb
  };
}

export default function OccasionPage({ params }: { params: { slug: string } }) {
  const occ = occasionBySlug(params.slug);
  if (!occ) return notFound();

  const list = getProductsByOccasion(occ.slug);
  const others = occasions.filter((o) => o.slug !== occ.slug).slice(0, 4);

  return (
    <>
      <section className="relative bg-cream">
        <Container className="pt-12 md:pt-16 pb-10 md:pb-14">
          <nav className="text-xs text-muted mb-6" aria-label="migas">
            <Link href="/" className="hover:text-forest">Inicio</Link>
            <span className="mx-2">/</span>
            <Link href="/coleccion" className="hover:text-forest">Colección</Link>
            <span className="mx-2">/</span>
            <span className="text-forest">{occ.name}</span>
          </nav>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-end">
            <div className="lg:col-span-7">
              <span className="eyebrow mb-4">Ocasión · desde {formatPriceShort(occ.startingPrice)}</span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-editorial leading-[1.02] text-balance">
                Arreglos para<br />
                <em className="italic text-clay">{occ.name.toLowerCase()}</em>.
              </h1>
              <p className="mt-6 text-base md:text-lg text-muted max-w-prose leading-relaxed">
                {occ.blurb}
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] rounded-sm overflow-hidden bg-ivory">
                <Image
                  src={occ.coverImage}
                  alt={occ.coverAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-cream py-section">
        <Container>
          {list.length === 0 ? (
            <p className="text-muted text-center py-16">
              Pronto agregaremos más arreglos para esta ocasión. Escríbenos por WhatsApp y te ayudamos.
            </p>
          ) : (
            <>
              <p className="text-sm text-muted mb-8">
                {list.length} {list.length === 1 ? 'arreglo de muestra' : 'arreglos de muestra'}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
                {list.map((p, i) => (
                  <ProductCard key={p._id} product={p} priority={i < 4} />
                ))}
              </div>
            </>
          )}
        </Container>
      </section>

      <section className="bg-ivory/40 py-section">
        <Container>
          <div className="flex items-end justify-between gap-6 mb-10">
            <h2 className="font-serif text-2xl md:text-3xl">Otras ocasiones</h2>
            <Link href="/coleccion" className="text-sm text-forest hover:text-clay">
              Ver todo
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/ocasion/${o.slug}`}
                className="group relative aspect-[4/5] rounded-sm overflow-hidden bg-ivory"
              >
                <Image
                  src={o.coverImage}
                  alt={o.coverAlt}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/70 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-cream">
                  <p className="font-serif text-lg">{o.name}</p>
                  <p className="text-[10px] uppercase tracking-wider text-cream/70 mt-1">
                    Desde {formatPriceShort(o.startingPrice)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
