import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ProductCard } from '@/components/product/ProductCard';
import { featuredProducts } from '@/lib/catalog';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function FeaturedGrid() {
  return (
    <section className="bg-ivory/40 py-section md:py-section-md">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14">
          <SectionTitle
            eyebrow="Catálogo de muestra"
            title="Arreglos destacados"
            description="Explora estilos y tamaños de referencia. Consulta las opciones reales y su disponibilidad por WhatsApp."
          />
          <Link
            href="/coleccion"
            className="inline-flex items-center gap-2 text-sm text-forest hover:text-clay self-start md:self-auto"
          >
            Ver los 12 arreglos <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
          {featuredProducts.map((p, i) => (
            <ProductCard key={p._id} product={p} priority={i < 4} />
          ))}
        </div>
      </Container>
    </section>
  );
}
