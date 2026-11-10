import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { CatalogFilters } from '@/components/catalog/CatalogFilters';
import { products } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'Colección',
  description:
    'Explora el catálogo de muestra de Norah’s Garden en Cochabamba.'
};

export default function ColeccionPage() {
  return (
    <section className="bg-cream py-section md:py-section-md">
      <Container>
        <div className="mb-10 md:mb-14">
          <SectionTitle
            as="h1"
            eyebrow="Colección"
            title="Encuentra un arreglo para tu ocasión."
            description="Catálogo de ejemplo: las fotos, productos y precios son de referencia. Consulta las opciones reales por WhatsApp antes de pagar."
          />
        </div>

        <Suspense fallback={<div className="text-muted">Cargando filtros…</div>}>
          <CatalogFilters products={products} total={products.length} />
        </Suspense>
      </Container>
    </section>
  );
}
