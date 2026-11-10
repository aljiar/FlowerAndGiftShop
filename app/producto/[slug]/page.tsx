import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Flower2, Leaf, Truck } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductBuyBox } from '@/components/product/ProductBuyBox';
import { ProductCard } from '@/components/product/ProductCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { getProductBySlug, products } from '@/lib/catalog';
import { categoryName } from '@/lib/categories';
import { formatPrice } from '@/lib/format';
import { site, commerceReady } from '@/lib/constants';

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getProductBySlug(params.slug);
  if (!p) return { title: 'Producto no encontrado' };
  return {
    title: p.name,
    description: p.shortDescription,
    openGraph: {
      title: p.name,
      description: p.shortDescription,
      images: [{ url: p.images[0].url }]
    }
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) return notFound();

  const related = products
    .filter((p) => p._id !== product._id && p.occasions.some((o) => product.occasions.includes(o)))
    .slice(0, 4);

  return (
    <>
      <section className="bg-cream py-10 md:py-14">
        <Container>
          <nav className="text-xs text-muted mb-6 md:mb-8" aria-label="migas">
            <Link href="/" className="hover:text-forest">Inicio</Link>
            <span className="mx-2">/</span>
            <Link href="/coleccion" className="hover:text-forest">Colección</Link>
            <span className="mx-2">/</span>
            <span className="text-forest">{product.name}</span>
          </nav>

          <div className="lg:hidden mb-6"><p className="eyebrow mb-3">{categoryName(product.category)}</p><h1 className="font-serif text-3xl mb-3">{product.name}</h1><p className="text-base">Desde {formatPrice(Math.min(...product.variants.map(variant => product.basePrice + variant.priceDelta)))}</p></div>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            <ProductGallery images={product.images} />
            <ProductBuyBox product={product} />
          </div>
        </Container>
      </section>

      <section className="bg-cream border-t border-line py-section">
        <Container className="max-w-3xl">
          <span className="eyebrow mb-3">Sobre este arreglo</span>
          <h2 className="font-serif text-2xl md:text-3xl tracking-editorial mb-5">
            Conoce este arreglo.
          </h2>
          <p className="text-muted leading-relaxed text-pretty">{product.longDescription}</p>

          <div className="grid sm:grid-cols-3 gap-6 mt-10 pt-10 border-t border-line">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-ivory flex items-center justify-center text-forest">
                <Flower2 size={16} strokeWidth={1.25} />
              </div>
              <div>
                <p className="font-serif text-base">Hecho a mano</p>
                <p className="text-xs text-muted mt-1">Consulta su composición y elaboración.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-ivory flex items-center justify-center text-forest">
                <Leaf size={16} strokeWidth={1.25} />
              </div>
              <div>
                <p className="font-serif text-base">Composición</p>
                <p className="text-xs text-muted mt-1">Confirma las flores disponibles.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-ivory flex items-center justify-center text-forest">
                <Truck size={16} strokeWidth={1.25} />
              </div>
              <div>
                <p className="font-serif text-base">Entrega cuidada</p>
                <p className="text-xs text-muted mt-1">Coordina los detalles antes de pagar.</p>
              </div>
            </div>
          </div>

          {product.care && (
            <div className="mt-10 p-5 rounded-sm bg-ivory/60">
              <p className="text-xs uppercase tracking-wider text-muted mb-2">Cómo cuidarlo</p>
              <p className="text-sm text-forest leading-relaxed">{product.care}</p>
            </div>
          )}

          {product.highlights && product.highlights.length > 0 && (
            <ul className="mt-8 grid sm:grid-cols-3 gap-3">
              {product.highlights.map((h) => (
                <li
                  key={h}
                  className="text-xs px-3 py-2 border border-line rounded-sm text-forest/80 text-center"
                >
                  {h}
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      {related.length > 0 && (
        <section className="bg-ivory/40 py-section">
          <Container>
            <div className="flex items-end justify-between gap-6 mb-10">
              <h2 className="font-serif text-2xl md:text-3xl">También te puede gustar</h2>
              <Link href="/coleccion" className="text-sm text-forest hover:text-clay">
                Ver todo
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {commerceReady && <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.longDescription,
          image: product.images.map((i) => i.url),
          brand: { '@type': 'Brand', name: site.name },
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: site.currency,
            lowPrice: Math.min(...product.variants.map((v) => product.basePrice + v.priceDelta)),
            highPrice: Math.max(...product.variants.map((v) => product.basePrice + v.priceDelta)),
            offerCount: product.variants.length,
            availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
          }
        }}
      />}
    </>
  );
}
