'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { products } from '@/lib/catalog';
import { deliveryZones, commerceReady, whatsappLink } from '@/lib/constants';
import { availableSlots, deliveryDates } from '@/lib/delivery';
import { checkoutSchema } from '@/lib/orders';
import { Input, Select, Textarea } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/format';

export function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore(s => s.items), hydrated = useCartStore(s => s.hydrated), clear = useCartStore(s => s.clear);
  const [step, setStep] = useState(1), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const [dates, setDates] = useState<ReturnType<typeof deliveryDates>>([]);
  const [form, setForm] = useState({ buyerName: '', email: '', phone: '', recipientName: '', recipientPhone: '', zoneId: 'centro', address: '', references: '', date: '', slotId: '', notes: '', method: 'qr' as 'qr' | 'transfer' });
  const attempt = useRef<{ body: string; requestId: string } | null>(null), submitting = useRef(false);
  useEffect(() => {
    const refresh = () => setDates(deliveryDates());
    refresh(); const timer = setInterval(refresh, 60000); return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    try { const saved = sessionStorage.getItem('petalo-checkout-attempt'); if (saved) attempt.current = JSON.parse(saved); } catch { /* El reintento sigue disponible en memoria. */ }
  }, []);
  const change = (name: keyof typeof form, value: string) => setForm(s => ({ ...s, [name]: value, ...(name === 'date' ? { slotId: '' } : {}) }));
  const lines = items.flatMap(item => {
    const product = products.find(p => p._id === item.productId), variant = product?.variants.find(v => v.id === item.variantId);
    return product && variant && product.inStock ? [{ item, product, variant, unit: product.basePrice + variant.priceDelta }] : [];
  });
  const subtotal = lines.reduce((sum, l) => sum + l.unit * l.item.qty, 0), zone = deliveryZones.find(z => z.id === form.zoneId)!;
  const deliveryFee = subtotal >= zone.freeFrom ? 0 : zone.fee, total = subtotal + deliveryFee;
  const slots = availableSlots(form.date);
  const payload = () => ({ buyer: { name: form.buyerName, email: form.email, phone: form.phone }, delivery: { recipientName: form.recipientName, recipientPhone: form.recipientPhone, zoneId: form.zoneId, address: form.address, references: form.references, date: form.date, slotId: form.slotId }, notes: form.notes, payment: { method: form.method }, items: items.map(({ productId, variantId, qty, message }) => ({ productId, variantId, qty, message })) });
  const advance = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError('');
    if (step === 1 && !checkoutSchema.shape.buyer.safeParse(payload().buyer).success) { setError('Revisa tu nombre, correo y teléfono.'); return; }
    if (step === 2 && !checkoutSchema.shape.delivery.safeParse(payload().delivery).success) { setError('Revisa el nombre, teléfono y dirección de quien recibe.'); return; }
    if (step === 2 && !availableSlots(form.date).some(s => s.id === form.slotId)) { setError('Selecciona una fecha y franja disponibles.'); return; }
    setStep(s => s + 1);
  };
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (submitting.current) return;
    setError('');
    const data = payload(), serialized = JSON.stringify(data);
    if (!attempt.current || attempt.current.body !== serialized) attempt.current = { body: serialized, requestId: crypto.randomUUID() };
    const body = { ...data, requestId: attempt.current.requestId };
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) { setError('Revisa los datos del comprador y destinatario: nombre, correo, teléfonos y dirección.'); setStep(1); return; }
    if (lines.length !== items.length || !availableSlots(form.date).some(s => s.id === form.slotId)) { setError('Revisa los productos y la fecha de entrega.'); setStep(2); return; }
    submitting.current = true; setBusy(true);
    try {
      try { sessionStorage.setItem('petalo-checkout-attempt', JSON.stringify(attempt.current)); } catch { /* La clave permanece en memoria. */ }
      const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data) });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'No se pudo guardar el pedido.');
      if (!result.orderId || !result.accessToken) throw new Error('Respuesta incompleta. Vuelve a intentarlo.');
      try { sessionStorage.removeItem('petalo-checkout-attempt'); } catch { /* La compra ya se guardó. */ }
      attempt.current = null;
      clear();
      router.push(`/checkout/confirmacion?id=${encodeURIComponent(result.orderId)}&token=${encodeURIComponent(result.accessToken)}`);
    } catch (e) { setError(e instanceof TypeError || e instanceof SyntaxError ? 'No pudimos conectar con la tienda. Tu carrito se conserva; vuelve a intentarlo.' : e instanceof Error ? e.message : 'No se pudo guardar tu pedido. Tu carrito se conserva.'); }
    finally { submitting.current = false; setBusy(false); }
  };
  if (!commerceReady) return <div className="container py-section max-w-2xl"><h1 className="font-serif text-3xl mb-5">Consulta tu regalo por WhatsApp</h1><p className="text-muted mb-6">El catálogo y sus precios son de ejemplo. Estamos definiendo zonas y tarifas, por lo que aún no recibimos pedidos desde la web. Tu carrito se conserva. Consulta disponibilidad y el importe total antes de pagar por QR o transferencia.</p><a className="inline-flex bg-forest text-cream px-6 py-4 rounded-sm" href={whatsappLink('Hola, quiero consultar disponibilidad, precio y entrega de un regalo de Norah’s Garden.')} target="_blank" rel="noreferrer">Consultar por WhatsApp</a><Link href="/carrito" className="block underline mt-5">Volver al carrito</Link></div>;
  if (!hydrated) return <div className="container py-section" role="status">Cargando tu pedido…</div>;
  if (!items.length) return <div className="container py-section text-center"><h1 className="font-serif text-3xl mb-5">Tu carrito está vacío</h1><Link href="/coleccion" className="underline">Explorar arreglos</Link></div>;
  return <div className="container py-section grid lg:grid-cols-[1fr_380px] gap-10">
    <div><Link href="/carrito" className="text-sm underline">Volver al carrito</Link><h1 className="font-serif text-3xl mt-6 mb-5">Finaliza tu pedido</h1>
      <ol className="flex gap-5 text-xs mb-8" aria-label="Pasos del pedido">{['Tus datos', 'Entrega', 'Confirmación'].map((label, i) => <li key={label} aria-current={step === i + 1 ? 'step' : undefined} className={step === i + 1 ? 'font-bold text-forest' : 'text-muted'}>{i + 1}. {label}</li>)}</ol>
      <form onSubmit={step === 3 ? submit : advance} className="space-y-5">
        {step === 1 && <><h2 className="font-serif text-2xl">¿Quién envía?</h2><Input label="Nombre completo" name="buyerName" autoComplete="name" required minLength={2} maxLength={100} value={form.buyerName} onChange={e => change('buyerName', e.target.value)} /><Input label="Correo electrónico" name="email" type="email" autoComplete="email" required maxLength={254} value={form.email} onChange={e => change('email', e.target.value)} /><Input label="Teléfono / WhatsApp" name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={24} value={form.phone} onChange={e => change('phone', e.target.value)} /></>}
        {step === 2 && <><h2 className="font-serif text-2xl">¿Dónde y cuándo?</h2><p className="text-sm text-muted">Todos los arreglos se entregan juntos, en una dirección y franja. Atendemos de lunes a sábado, con al menos dos horas de preparación.</p>
          <Input label="Nombre de quien recibe" name="recipientName" required minLength={2} maxLength={100} value={form.recipientName} onChange={e => change('recipientName', e.target.value)} /><Input label="Teléfono de quien recibe" name="recipientPhone" type="tel" required minLength={7} maxLength={24} value={form.recipientPhone} onChange={e => change('recipientPhone', e.target.value)} />
          <Select label="Zona de entrega" name="zoneId" value={form.zoneId} onChange={e => change('zoneId', e.target.value)}>{deliveryZones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}</Select>
          <Input label="Dirección" name="address" required minLength={5} maxLength={300} value={form.address} onChange={e => change('address', e.target.value)} /><Input label="Referencias (opcional)" name="references" maxLength={300} value={form.references} onChange={e => change('references', e.target.value)} />
          <Select label="Fecha de entrega" name="date" required value={form.date} onChange={e => change('date', e.target.value)}><option value="">Selecciona una fecha</option>{dates.map(d => <option key={d.value} value={d.value} disabled={!d.available}>{d.label}{!d.available ? ' · no disponible' : ''}</option>)}</Select>
          <Select label="Franja horaria" name="slotId" required value={form.slotId} onChange={e => change('slotId', e.target.value)}><option value="">Selecciona una franja</option>{slots.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}</Select>
          <Textarea label="Notas para la entrega (opcional)" name="notes" maxLength={500} value={form.notes} onChange={e => change('notes', e.target.value)} />
        </>}
        {step === 3 && <><h2 className="font-serif text-2xl">Revisa y confirma</h2><div className="bg-ivory/50 p-5 text-sm space-y-2"><p>{form.buyerName} · {form.email} · {form.phone}</p><p>Recibe: {form.recipientName} · {form.recipientPhone}</p><p>{form.address} · {zone.name}</p><p>{dates.find(d => d.value === form.date)?.label} · {slots.find(s => s.id === form.slotId)?.label || 'Franja vencida: vuelve a Entrega'}</p></div>
          <fieldset className="space-y-3"><legend className="text-sm mb-3">¿Cómo prefieres pagar?</legend>{[{ id: 'qr', label: 'QR' }, { id: 'transfer', label: 'Transferencia bancaria' }].map(method => <label key={method.id} className="flex gap-3 border border-line p-4"><input type="radio" name="method" value={method.id} checked={form.method === method.id} onChange={e => change('method', e.target.value)} />{method.label}</label>)}</fieldset>
          <p className="text-sm text-muted">Al confirmar guardaremos tu pedido como pendiente de pago. En el siguiente paso podrás escribirnos por WhatsApp para recibir los datos de pago y coordinar la entrega.</p>
        </>}
        {error && <p role="alert" className="text-clay text-sm">{error}</p>}
        <div className="flex flex-wrap justify-between gap-3 pt-5 border-t border-line">{step > 1 && <Button variant="secondary" disabled={busy} onClick={() => { setStep(s => s - 1); setError(''); }}>Atrás</Button>}<Button type="submit" disabled={busy || lines.length !== items.length}>{busy ? <><Loader2 size={16} className="animate-spin" /> Guardando…</> : step === 3 ? 'Confirmar pedido' : <>Continuar <ArrowRight size={14} /></>}</Button></div>
      </form>
    </div>
    <aside className="lg:sticky lg:top-28 self-start border border-line rounded-sm p-6"><h2 className="font-serif text-xl mb-5">Tu pedido</h2><ul className="space-y-4">{lines.map(({ item, product, variant, unit }) => <li key={item.id} className="flex gap-3"><div className="relative w-14 h-16 shrink-0"><Image src={product.images[0].url} alt={product.images[0].alt} fill sizes="56px" className="object-cover rounded-sm" /></div><div className="text-sm flex-1"><p>{product.name}</p><p className="text-xs text-muted">{variant.label} × {item.qty}</p>{item.message && <p className="text-xs text-muted whitespace-pre-wrap">{item.message}</p>}<p>{formatPrice(unit * item.qty)}</p></div></li>)}</ul>
      {lines.length !== items.length && <p role="alert" className="text-clay text-sm mt-4">Hay productos no disponibles. Revisa tu carrito.</p>}
      <dl className="text-sm space-y-3 border-t border-line mt-5 pt-5"><div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div><div className="flex justify-between"><dt>Envío · {zone.name}</dt><dd>{deliveryFee ? formatPrice(deliveryFee) : 'Gratis'}</dd></div><div className="flex justify-between font-serif text-2xl"><dt>Total</dt><dd>{formatPrice(total)}</dd></div></dl>
    </aside>
  </div>;
}
