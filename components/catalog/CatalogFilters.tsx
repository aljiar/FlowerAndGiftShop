'use client';

import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { useModal } from '@/lib/useModal';
import { productPriceRange } from '@/lib/catalog';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import type { FlowerTag, OccasionSlug, Product, VariantSize } from '@/types';
import { cn } from '@/lib/cva';

interface Props {
  products: Product[];
  total: number;
}

const flowerLabels: Record<FlowerTag, string> = {
  rosas: 'Rosas',
  peonias: 'Peonías',
  tulipanes: 'Tulipanes',
  hortensias: 'Hortensias',
  girasoles: 'Girasoles',
  lilis: 'Lilis',
  lavanda: 'Lavanda',
  wildflowers: 'Silvestres',
  suculentas: 'Suculentas',
  exoticas: 'Exóticas'
};

const occasionLabels: Record<OccasionSlug, string> = {
  cumpleanos: 'Cumpleaños',
  amor: 'Amor',
  agradecimientos: 'Agradecimientos',
  condolencias: 'Condolencias',
  nacimientos: 'Nacimientos',
  aniversario: 'Aniversario',
  corporativo: 'Corporativo'
};

type SortKey = 'relevancia' | 'precio-asc' | 'precio-desc' | 'nuevos';

const sortOptions: Array<{ value: SortKey; label: string }> = [
  { value: 'relevancia', label: 'Relevancia' },
  { value: 'nuevos', label: 'Más nuevos' },
  { value: 'precio-asc', label: 'Precio: menor a mayor' },
  { value: 'precio-desc', label: 'Precio: mayor a menor' }
];

function applyFilters(
  products: Product[],
  filters: {
    flowers?: FlowerTag[];
    occasions?: OccasionSlug[];
    sizes?: VariantSize[];
    priceMin?: number;
    priceMax?: number;
    sort?: SortKey;
  }
) {
  let list = [...products];
  if (filters.flowers?.length) {
    list = list.filter((p) => p.flowers.some((f) => filters.flowers!.includes(f)));
  }
  if (filters.occasions?.length) {
    list = list.filter((p) => p.occasions.some((o) => filters.occasions!.includes(o)));
  }
  if (filters.sizes?.length) {
    list = list.filter((p) => p.variants.some((v) => filters.sizes!.includes(v.size)));
  }
  if (typeof filters.priceMin === 'number') {
    list = list.filter((p) => productPriceRange(p).min >= filters.priceMin!);
  }
  if (typeof filters.priceMax === 'number') {
    list = list.filter((p) => productPriceRange(p).min <= filters.priceMax!);
  }
  switch (filters.sort) {
    case 'precio-asc':
      list.sort((a, b) => productPriceRange(a).min - productPriceRange(b).min);
      break;
    case 'precio-desc':
      list.sort((a, b) => productPriceRange(b).min - productPriceRange(a).min);
      break;
    case 'nuevos':
      list.sort((a, b) => Number(b.tags.includes('nuevo')) - Number(a.tags.includes('nuevo')));
      break;
    default:
      break;
  }
  return list;
}

export function CatalogFilters({ products, total }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const closeFilters = useCallback(() => setOpen(false), []);
  useModal(open, closeFilters, panel);
  const [flowers, setFlowers] = useState<FlowerTag[]>([]);
  const [occasions, setOccasions] = useState<OccasionSlug[]>([]);
  const [sizes, setSizes] = useState<VariantSize[]>([]);
  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');
  const [sort, setSort] = useState<SortKey>('relevancia');

  // Hidratar desde query params
  useEffect(() => {
    const o = params.get('occasion');
    setOccasions(o && o in occasionLabels ? [o as OccasionSlug] : []);
    const f = params.get('flower');
    setFlowers(f && f in flowerLabels ? [f as FlowerTag] : []);
    const pmax = params.get('priceMax');
    setPriceMax(pmax && Number.isFinite(Number(pmax)) ? pmax : '');
    const pmin = params.get('priceMin');
    setPriceMin(pmin && Number.isFinite(Number(pmin)) ? pmin : '');
    const s = params.get('sort') as typeof sort | null;
    setSort(sortOptions.some(o => o.value === s) ? s! : 'relevancia');
  }, [params]);

  const filtered = useMemo(
    () =>
      applyFilters(products, {
        flowers,
        occasions,
        sizes,
        priceMin: priceMin ? Number(priceMin) : undefined,
        priceMax: priceMax ? Number(priceMax) : undefined,
        sort
      }),
    [products, flowers, occasions, sizes, priceMin, priceMax, sort]
  );

  const toggle = <T,>(arr: T[], v: T, setter: (a: T[]) => void) => {
    setter(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  };

  const reset = () => {
    setFlowers([]);
    setOccasions([]);
    setSizes([]);
    setPriceMin('');
    setPriceMax('');
    setSort('relevancia');
    router.replace('/coleccion');
  };

  const FilterPanel = (
    <div className="space-y-8">
      <div>
        <p className="eyebrow mb-3">Tipo de flor</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(flowerLabels).map(([k, label]) => {
            const active = flowers.includes(k as FlowerTag);
            return (
              <button
                key={k}
                type="button"
                onClick={() => toggle(flowers, k as FlowerTag, setFlowers)}
                className={cn(
                  'px-3 py-1.5 text-xs rounded-sm border transition-colors',
                  active
                    ? 'bg-forest text-cream border-forest'
                    : 'bg-cream text-forest border-line hover:border-forest'
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="eyebrow mb-3">Ocasión</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(occasionLabels).map(([k, label]) => {
            const active = occasions.includes(k as OccasionSlug);
            return (
              <button
                key={k}
                type="button"
                onClick={() => toggle(occasions, k as OccasionSlug, setOccasions)}
                className={cn(
                  'px-3 py-1.5 text-xs rounded-sm border transition-colors',
                  active
                    ? 'bg-forest text-cream border-forest'
                    : 'bg-cream text-forest border-line hover:border-forest'
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="eyebrow mb-3">Tamaño</p>
        <div className="flex gap-2">
          {(['S', 'M', 'L', 'XL'] as VariantSize[]).map((s) => {
            const active = sizes.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggle(sizes, s, setSizes)}
                className={cn(
                  'w-10 h-10 text-xs rounded-sm border transition-colors',
                  active
                    ? 'bg-forest text-cream border-forest'
                    : 'bg-cream text-forest border-line hover:border-forest'
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="eyebrow mb-3">Precio (BOB)</p>
        <div className="flex items-center gap-3">
          <Input
            type="number"
            aria-label="Precio mínimo"
            inputMode="numeric"
            placeholder="Mín."
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-24"
            min={0}
          />
          <span className="text-muted">—</span>
          <Input
            type="number"
            aria-label="Precio máximo"
            inputMode="numeric"
            placeholder="Máx."
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-24"
            min={0}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={reset}
        className="text-xs uppercase tracking-wider text-muted hover:text-clay"
      >
        Limpiar filtros
      </button>
    </div>
  );

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-10 lg:gap-14">
      <aside className="hidden lg:block sticky top-28 self-start">
        <div className="flex items-center gap-2 mb-6">
          <SlidersHorizontal size={16} strokeWidth={1.5} />
          <p className="font-serif text-lg">Filtros</p>
        </div>
        {FilterPanel}
      </aside>

      <div>
        <div className="flex items-center justify-between mb-6 gap-3">
          <p className="text-sm text-muted">
            <span className="text-forest font-medium">{filtered.length}</span> de {total} arreglos
          </p>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-xs uppercase tracking-wider text-muted hidden sm:inline">
              Ordenar
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="bg-cream border border-line rounded-sm px-3 py-2 text-xs uppercase tracking-wider"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="lg:hidden inline-flex items-center gap-2 text-xs uppercase tracking-wider text-forest border border-line px-3 py-2 rounded-sm"
              onClick={() => setOpen(true)}
            >
              <Filter size={14} strokeWidth={1.5} /> Filtros
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-serif text-2xl mb-2">No encontramos arreglos con esos filtros.</p>
            <p className="text-muted text-sm">Probá quitar alguno o ampliar el rango de precio.</p>
            <Button variant="secondary" className="mt-6" onClick={reset}>
              Limpiar filtros
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10">
            {filtered.map((p) => (
              <ProductCardFiltered key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-forest/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div ref={panel} role="dialog" aria-modal="true" aria-label="Filtros del catálogo" tabIndex={-1} className="absolute inset-y-0 right-0 w-full sm:w-[420px] bg-cream shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 h-16 border-b border-line">
              <p className="font-serif text-xl">Filtros</p>
              <button onClick={() => setOpen(false)} aria-label="Cerrar filtros" className="p-2">
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6">{FilterPanel}</div>
            <div className="px-5 py-4 border-t border-line">
              <Button fullWidth onClick={() => setOpen(false)}>
                Ver {filtered.length} resultados
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// re-export a la grilla
import { ProductCard } from '@/components/product/ProductCard';
function ProductCardFiltered({ product }: { product: Product }) {
  return <ProductCard product={product} />;
}
