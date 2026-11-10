'use client';
import Link from 'next/link';
import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X } from 'lucide-react';
import { useModal } from '@/lib/useModal';
import { categories } from '@/lib/categories';
import { whatsappLink } from '@/lib/constants';
import { emptyFilters, readFilters, filterQuery, filterProducts, flowerLabels, occasionLabels, sortOptions, type FilterSelection } from '@/lib/catalog-filters';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import { ProductCard } from '@/components/product/ProductCard';
import type { Product } from '@/types';

export function CatalogFilters({ products, total }: { products: Product[]; total: number }) {
  const router = useRouter();
  const params = useSearchParams();
  const query = params.toString();
  const selection = useMemo(() => readFilters(new URLSearchParams(query)), [query]);
  const [draft, setDraft] = useState(selection);
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useModal(open, close, panel);
  useEffect(() => setDraft(selection), [selection]);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const sync = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener('change', sync);
    return () => desktop.removeEventListener('change', sync);
  }, []);
  const filtered = useMemo(() => filterProducts(products, selection), [products, selection]);
  const draftCount = useMemo(() => filterProducts(products, draft).length, [products, draft]);
  const invalidRange = draft.priceMin !== '' && draft.priceMax !== '' && Number(draft.priceMin) > Number(draft.priceMax);
  const navigate = (next: FilterSelection) => {
    const search = filterQuery(next);
    router.push(`/coleccion${search ? `?${search}` : ''}`, { scroll: false });
    setDraft(next);
    close();
  };
  const toggle = (key: 'categories' | 'flowers' | 'occasions' | 'sizes', value: string) => {
    setDraft(current => ({ ...current, [key]: (current[key] as string[]).includes(value) ? current[key].filter(item => item !== value) : [...current[key], value] }));
  };
  const groups = [
    { key: 'categories' as const, title: 'Tipo de regalo', entries: categories.map(category => [category.slug, category.name]) },
    { key: 'occasions' as const, title: 'Ocasión', entries: Object.entries(occasionLabels) },
    { key: 'sizes' as const, title: 'Tamaño', entries: ['S', 'M', 'L', 'XL'].map(size => [size, size]) },
    { key: 'flowers' as const, title: 'Tipo de flor', entries: Object.entries(flowerLabels) }
  ];
  const chipStyle = 'min-h-11 inline-flex items-center justify-center rounded-sm border px-3 py-2 text-sm text-left';
  const filterPanel = (prefix: string) => <form className="space-y-6" onSubmit={event => { event.preventDefault(); if (!invalidRange) navigate(draft); }}>
    {groups.map(group => <fieldset key={group.key}>
      <legend className="text-sm font-medium mb-3">{group.title}</legend>
      <div className="flex flex-wrap gap-2">{group.entries.map(([value, label]) => {
        const active = (draft[group.key] as string[]).includes(value);
        return <button key={value} type="button" aria-pressed={active} onClick={() => toggle(group.key, value)} className={`${chipStyle} ${active ? 'bg-forest text-cream border-forest' : 'border-line hover:border-forest'}`}>{label}</button>;
      })}</div>
    </fieldset>)}
    <fieldset><legend className="text-sm font-medium mb-3">Presupuesto en Bs</legend>
      <div className="grid grid-cols-2 gap-3">
        <Input id={`${prefix}-min`} label="Desde" type="number" inputMode="numeric" min={0} step="any" placeholder="Sin mínimo" value={draft.priceMin} onChange={event => setDraft(current => ({ ...current, priceMin: event.target.value }))} />
        <Input id={`${prefix}-max`} label="Hasta" type="number" inputMode="numeric" min={0} step="any" placeholder="Sin máximo" value={draft.priceMax} onChange={event => setDraft(current => ({ ...current, priceMax: event.target.value }))} error={invalidRange ? 'Debe ser igual o mayor al mínimo.' : undefined} />
      </div>
    </fieldset>
    <div className="sticky bottom-0 bg-cream pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] space-y-2">
      <Button fullWidth type="submit" disabled={invalidRange}>Ver {draftCount} resultados</Button>
      <Button fullWidth variant="ghost" onClick={() => navigate(emptyFilters)}>Limpiar filtros</Button>
    </div>
  </form>;
  return <div className="grid lg:grid-cols-[260px_minmax(0,1fr)] gap-8 lg:gap-12">
    <aside className="hidden lg:block self-start" aria-label="Filtros del catálogo"><h2 className="font-serif text-xl mb-5">Encuentra tu regalo</h2>{filterPanel('desktop')}</aside>
    <div className="min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <p className="text-sm text-muted" role="status" aria-live="polite"><span className="font-medium text-forest">{filtered.length}</span> de {total} productos de muestra</p>
        <div className="flex items-center gap-2 min-w-0">
          <label htmlFor="catalog-sort" className="sr-only">Ordenar productos</label>
          <select id="catalog-sort" value={selection.sort} onChange={event => navigate({ ...selection, sort: event.target.value as FilterSelection['sort'] })} className="min-h-11 flex-1 min-w-0 rounded-sm bg-cream border border-line px-3 text-sm">
            {sortOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          <button type="button" onClick={() => { setDraft(selection); setOpen(true); }} aria-haspopup="dialog" aria-expanded={open} className={`${chipStyle} lg:hidden gap-2 border-forest shrink-0`}><Filter size={16} />Filtros</button>
        </div>
      </div>
      <nav aria-label="Categorías del catálogo" className="flex flex-wrap gap-2 mb-4">
        {categories.map(category => <button key={category.slug} type="button" aria-pressed={selection.categories.includes(category.slug)} className={`${chipStyle} ${selection.categories.includes(category.slug) ? 'bg-forest text-cream border-forest' : 'border-line'}`} onClick={() => navigate({ ...selection, categories: selection.categories.length === 1 && selection.categories[0] === category.slug ? [] : [category.slug] })}>{category.name}</button>)}
      </nav>
      <div className="flex flex-wrap gap-2 mb-5" aria-label="Presupuestos rápidos">
        {[{ label: 'Hasta Bs 200', min: '', max: '200' }, { label: 'Bs 200–350', min: '200', max: '350' }, { label: 'Desde Bs 350', min: '350', max: '' }].map(budget => <button type="button" key={budget.label} aria-pressed={selection.priceMin === budget.min && selection.priceMax === budget.max} onClick={() => navigate({ ...selection, priceMin: budget.min, priceMax: budget.max })} className={`${chipStyle} border-line bg-ivory/50`}>{budget.label}</button>)}
      </div>
      <div className="flex flex-wrap gap-2 mb-6" aria-label="Filtros aplicados">
        {groups.flatMap(group => selection[group.key].map(value => <button key={`${group.key}-${value}`} type="button" className="pill min-h-11" aria-label={`Quitar filtro ${group.entries.find(entry => entry[0] === value)?.[1] || value}`} onClick={() => navigate({ ...selection, [group.key]: selection[group.key].filter(item => item !== value) })}>{group.entries.find(entry => entry[0] === value)?.[1] || value}<X size={14} /></button>))}
        {(selection.priceMin !== '' || selection.priceMax !== '') && <button type="button" className="pill min-h-11" aria-label="Quitar filtro de presupuesto" onClick={() => navigate({ ...selection, priceMin: '', priceMax: '' })}>Bs {selection.priceMin || '0'}–{selection.priceMax || 'sin límite'}<X size={14} /></button>}
      </div>
      {!filtered.length ? <div className="rounded-lg border border-line p-6 md:p-10 text-center">
        <h2 className="font-serif text-2xl mb-3">No hay muestras para esta selección.</h2>
        <p className="text-sm text-muted mb-6">Puedes ampliar el presupuesto o quitar filtros. Para eternas, globos, peluches y combos, consulta las opciones por WhatsApp.</p>
        <Button variant="secondary" onClick={() => navigate(emptyFilters)}>Ver todo el catálogo</Button>
        <a href={whatsappLink(`Hola, quiero consultar opciones de ${selection.categories.map(slug => categories.find(category => category.slug === slug)?.name).join(', ') || 'regalos'} en Norah’s Garden.`)} target="_blank" rel="noreferrer" className="flex min-h-11 justify-center items-center underline text-sm mt-4">Consultar por WhatsApp</a>
      </div> : <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 sm:gap-x-5 gap-y-8">{filtered.map(product => <ProductCard key={product._id} product={product} />)}</div>}
      <Link href="/contacto#entregas" className="inline-flex min-h-11 items-center underline text-sm mt-8">Consulta cobertura y condiciones de entrega</Link>
    </div>
    {open && <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-forest/30 backdrop-blur-sm" onClick={close} aria-hidden="true" />
      <div ref={panel} role="dialog" aria-modal="true" aria-label="Filtros del catálogo" tabIndex={-1} className="absolute inset-y-0 right-0 w-full sm:max-w-md bg-cream flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 min-h-16 border-b border-line shrink-0"><h2 className="font-serif text-xl">Encuentra tu regalo</h2><button type="button" onClick={close} aria-label="Cerrar filtros" className="w-11 h-11 inline-flex items-center justify-center"><X size={20} /></button></div>
        <div className="flex-1 overflow-y-auto px-5 pt-6">{filterPanel('mobile')}</div>
      </div>
    </div>}
  </div>;
}
