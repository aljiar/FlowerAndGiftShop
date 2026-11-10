import Link from 'next/link';
import { Flower2, Infinity, PartyPopper, Heart, Gift, Sprout } from 'lucide-react';
import { categories } from '@/lib/categories';
import { products } from '@/lib/catalog';
import { Container } from '@/components/ui/Container';

const icons = [Flower2, Infinity, PartyPopper, Heart, Gift, Sprout];

export function CategoryGrid() {
  return <section className="py-12 md:py-16 border-y border-line" aria-labelledby="categories-title">
    <Container>
      <p className="eyebrow mb-3">Encuentra tu regalo</p>
      <h2 id="categories-title" className="font-serif text-3xl mb-3">¿Qué te gustaría regalar?</h2>
      <p className="text-sm text-muted mb-8">Explora por tipo de producto. Las categorías sin muestras se pueden consultar por WhatsApp.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {categories.map((category, index) => {
          const Icon = icons[index];
          const count = products.filter(product => product.category === category.slug).length;
          return <Link href={`/coleccion?category=${category.slug}`} key={category.slug} className="rounded-lg border border-line bg-cream p-4 hover:border-forest transition-colors min-w-0">
            <Icon size={24} className="text-forest mb-4" aria-hidden="true" />
            <h3 className="font-serif text-lg leading-snug">{category.name}</h3>
            <p className="text-xs text-muted mt-2">{category.description}</p>
            <p className="text-xs text-forest mt-3">{count ? `${count} ${count === 1 ? 'muestra' : 'muestras'}` : 'Sin muestras aún'}</p>
          </Link>;
        })}
      </div>
      <div className="flex flex-wrap gap-2 mt-6" aria-label="Explorar por presupuesto">
        <Link href="/coleccion?priceMax=200" className="pill min-h-11">Hasta Bs 200</Link>
        <Link href="/coleccion?priceMin=200&priceMax=350" className="pill min-h-11">Bs 200–350</Link>
        <Link href="/coleccion?priceMin=350" className="pill min-h-11">Desde Bs 350</Link>
      </div>
    </Container>
  </section>;
}
