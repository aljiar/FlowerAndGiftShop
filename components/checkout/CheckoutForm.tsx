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
import { checkoutErrors, checkoutPayload, readCheckoutDraft, saveCheckoutDraft, clearCheckoutDraft, initialCheckoutForm, type CheckoutFormData, type CheckoutErrors } from '@/lib/checkout-draft';
import { Input, Select, Textarea } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/format';

function session() {
  try { return window.sessionStorage; } catch { return undefined; }
}

export function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore(state => state.items);
  const hydrated = useCartStore(state => state.hydrated);
  const clear = useCartStore(state => state.clear);
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [dates, setDates] = useState<ReturnType<typeof deliveryDates>>([]);
  const [form, setForm] = useState({ ...initialCheckoutForm });
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [restored, setRestored] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(1);
  const attempt = useRef<{ body: string; requestId: string } | null>(null);
  const submitting = useRef(false);
  const completed = useRef(false);

  useEffect(() => {
    if (!commerceReady) return;
    const refresh = () => setDates(deliveryDates());
    refresh();
    const timer = setInterval(refresh, 60000);
    const saved = readCheckoutDraft(session());
    setForm(saved.form);
    setStep(saved.step);
    setRestored(Boolean(saved.form.buyerName || saved.form.address || saved.form.phone));
    try {
      if (!saved.form.buyerName && !saved.form.phone) session()?.removeItem('petalo-checkout-attempt');
      const raw = session()?.getItem('petalo-checkout-attempt');
      const value = raw ? JSON.parse(raw) : null;
      if (value && typeof value.body === 'string' && typeof value.requestId === 'string') attempt.current = value;
    } catch { /* El reintento sigue disponible en memoria. */ }
    setDraftLoaded(true);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (commerceReady && draftLoaded && !completed.current) saveCheckoutDraft(session(), { form, step });
  }, [form, step, draftLoaded]);
  useEffect(() => {
    if (step !== previousStep.current) {
      previousStep.current = step;
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ block: 'start', behavior: 'auto' });
    }
  }, [step]);

  const change = (name: keyof CheckoutFormData, value: string) => {
    setForm(current => ({ ...current, [name]: value, ...(name === 'date' ? { slotId: '' } : {}) }));
    setErrors(current => ({ ...current, [name]: undefined }));
    setError('');
  };
  const lines = items.flatMap(item => {
    const product = products.find(product => product._id === item.productId);
    const variant = product?.variants.find(variant => variant.id === item.variantId);
    return product && variant && product.inStock ? [{ item, product, variant, unit: product.basePrice + variant.priceDelta }] : [];
  });
  const subtotal = lines.reduce((sum, line) => sum + line.unit * line.item.qty, 0);
  const zone = deliveryZones.find(zone => zone.id === form.zoneId);
  const deliveryFee = zone ? subtotal >= zone.freeFrom ? 0 : zone.fee : null;
  const total = subtotal + (deliveryFee || 0);
  const slots = availableSlots(form.date);
  const payload = () => ({ ...checkoutPayload(form), items: items.map(({ productId, variantId, qty, message }) => ({ productId, variantId, qty, message })) });
  const showErrors = (next: CheckoutErrors, targetStep: number) => {
    setErrors(next);
    setError('Revisa los campos señalados para continuar.');
    setStep(targetStep);
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
  };
  const advance = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = checkoutErrors(form, step);
    if (Object.keys(next).length) { showErrors(next, step); return; }
    setError(''); setErrors({}); setStep(current => current + 1);
  };
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting.current || !commerceReady) return;
    for (const target of [1, 2]) {
      const next = checkoutErrors(form, target);
      if (Object.keys(next).length) { showErrors(next, target); return; }
    }
    if (lines.length !== items.length) { setError('Hay productos no disponibles. Vuelve al carrito para revisarlos.'); return; }
    const data = payload();
    const serialized = JSON.stringify(data);
    if (!attempt.current || attempt.current.body !== serialized) attempt.current = { body: serialized, requestId: crypto.randomUUID() };
    const parsed = checkoutSchema.safeParse({ ...data, requestId: attempt.current.requestId });
    if (!parsed.success) { setError('Revisa los datos del pedido antes de confirmar.'); return; }
    submitting.current = true; setBusy(true); setError('');
    try {
      try { session()?.setItem('petalo-checkout-attempt', JSON.stringify(attempt.current)); } catch { /* La clave permanece en memoria. */ }
      const response = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo guardar el pedido.');
      if (!result.orderId || !result.accessToken) throw new Error('Respuesta incompleta. Tu carrito se conserva; vuelve a intentarlo.');
      completed.current = true;
      clearCheckoutDraft(session());
      try { session()?.removeItem('petalo-checkout-attempt'); } catch { /* El pedido ya se guardó. */ }
      attempt.current = null;
      clear();
      router.push(`/checkout/confirmacion?id=${encodeURIComponent(result.orderId)}&token=${encodeURIComponent(result.accessToken)}`);
    } catch (failure) {
      setError(failure instanceof TypeError || failure instanceof SyntaxError ? 'No pudimos conectar con la tienda. Conservamos tu carrito y tus datos; vuelve a intentarlo.' : failure instanceof Error ? failure.message : 'No se pudo guardar tu pedido. Vuelve a intentarlo.');
    } finally { submitting.current = false; setBusy(false); }
  };
  const eraseDraft = () => {
    clearCheckoutDraft(session());
    try { session()?.removeItem('petalo-checkout-attempt'); } catch { /* Se conserva el carrito. */ }
    attempt.current = null; setForm({ ...initialCheckoutForm }); setStep(1); setRestored(false); setErrors({}); setError('');
  };

  const summaryContent = <>
    <ul className="space-y-4">{lines.map(({ item, product, variant, unit }) => <li key={item.id} className="flex gap-3">
      <div className="relative w-14 h-16 shrink-0"><Image src={product.images[0].url} alt={product.images[0].alt} fill sizes="56px" className="object-cover rounded-sm" /></div>
      <div className="text-sm flex-1 min-w-0 break-words"><p>{product.name}</p><p className="text-muted">{variant.label} × {item.qty}</p>{item.message && <p className="text-muted whitespace-pre-wrap">Tarjeta: {item.message}</p>}<p>{formatPrice(unit * item.qty)}</p></div>
    </li>)}</ul>
    {lines.length !== items.length && <p role="alert" className="text-sm mt-4">Hay productos no disponibles. <Link href="/carrito" className="underline">Revisa tu carrito.</Link></p>}
    <dl className="text-sm space-y-3 border-t border-line mt-5 pt-5">
      <div className="flex justify-between gap-3"><dt>Subtotal{!commerceReady ? ' de referencia' : ''}</dt><dd>{formatPrice(subtotal)}</dd></div>
      <div className="flex justify-between gap-3"><dt>Entrega{commerceReady && zone ? ` · ${zone.name}` : ''}</dt><dd className="text-right">{!commerceReady ? 'A coordinar' : deliveryFee === null ? 'Selecciona una zona' : deliveryFee === 0 ? 'Gratis' : formatPrice(deliveryFee)}</dd></div>
      {commerceReady && deliveryFee !== null && <div className="flex justify-between font-serif text-2xl"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>}
    </dl>
  </>;
  if (!hydrated) return <div className="container py-section" role="status">Cargando tu pedido…</div>;
  if (!commerceReady) return <div className="container py-10 md:py-section max-w-2xl">
    <h1 className="font-serif text-3xl mb-5">Consulta tu regalo por WhatsApp</h1>
    <p className="text-muted mb-6">El catálogo y sus precios son de ejemplo. Estamos definiendo zonas y tarifas, por lo que aún no recibimos pedidos desde la web. Tu carrito se conserva. Consulta disponibilidad y el importe total antes de pagar por QR o transferencia.</p>
    {lines.length > 0 && <section className="border border-line rounded-lg p-5 mb-6" aria-label="Resumen de tu selección"><h2 className="font-serif text-xl mb-5">Tu selección de muestra</h2>{summaryContent}</section>}
    <a className="flex min-h-12 items-center justify-center bg-forest text-cream px-5 py-3 rounded-sm text-sm" href={whatsappLink(`Hola, quiero consultar disponibilidad, precio y entrega de un regalo de Norah’s Garden.${lines.length ? ' Me interesan estas muestras: ' + lines.slice(0, 10).map(line => `${line.item.qty} × ${line.product.name} (${line.variant.label})`).join('; ') + '. Sé que los precios son de referencia.' : ''}`)} target="_blank" rel="noreferrer">Consultar por WhatsApp</a>
    <Link href="/carrito" className="inline-flex min-h-11 items-center underline mt-3">Volver al carrito</Link>
  </div>;
  if (!draftLoaded) return <div className="container py-section" role="status">Recuperando tus datos…</div>;
  if (!items.length) return <div className="container py-section text-center"><h1 className="font-serif text-3xl mb-5">Tu carrito está vacío</h1><Link href="/coleccion" className="underline">Explorar regalos</Link></div>;
  const totalLabel = deliveryFee === null ? `Subtotal ${formatPrice(subtotal)} · entrega pendiente` : `Total ${formatPrice(total)}`;
  return <div className="container py-8 md:py-section grid lg:grid-cols-[minmax(0,1fr)_360px] gap-8 lg:gap-12">
    <div className="min-w-0">
      <Link href="/carrito" className="inline-flex items-center min-h-11 text-sm underline">Volver al carrito</Link>
      <h1 className="font-serif text-3xl mt-4 mb-5">Finaliza tu pedido</h1>
      <ol className="grid grid-cols-3 gap-2 text-sm mb-6" aria-label="Pasos del pedido">{['Tus datos', 'Entrega', 'Confirmación'].map((label, index) => <li key={label} aria-current={step === index + 1 ? 'step' : undefined} className={`border-b-2 pb-3 ${step === index + 1 ? 'font-semibold border-forest' : 'border-line text-muted'}`}>{index + 1}. {label}</li>)}</ol>
      <details className="lg:hidden border border-line rounded-lg p-4 mb-6"><summary className="min-h-11 flex flex-col justify-center cursor-pointer"><span className="font-medium text-sm">{totalLabel}</span><span className="text-sm underline mt-1">Ver productos y entrega</span></summary><div className="pt-4">{summaryContent}</div></details>
      {restored && <p role="status" className="text-sm bg-ivory p-3 rounded-sm mb-5">Recuperamos tus datos guardados en esta pestaña.</p>}
      <p className="text-sm text-muted mb-5">Conservamos tus datos en esta pestaña durante un máximo de dos horas desde tu última edición. <button type="button" onClick={eraseDraft} disabled={busy} className="underline min-h-11">Borrar datos</button></p>
      <form ref={formRef} noValidate onSubmit={step === 3 ? submit : advance}>
        <fieldset disabled={busy} className="space-y-5 min-w-0">
          <h2 ref={heading} tabIndex={-1} className="font-serif text-2xl scroll-mt-28">{step === 1 ? '¿Quién envía?' : step === 2 ? '¿Dónde y cuándo?' : 'Revisa y confirma'}</h2>
          {step === 1 && <>
            <Input label="Nombre completo" name="buyerName" autoComplete="section-buyer name" required minLength={2} maxLength={100} value={form.buyerName} onChange={event => change('buyerName', event.target.value)} error={errors.buyerName} />
            <Input label="Teléfono / WhatsApp" name="phone" type="tel" autoComplete="section-buyer tel" required maxLength={24} value={form.phone} onChange={event => change('phone', event.target.value)} error={errors.phone} hint="Puedes incluir el prefijo del país." />
            <Input label="Correo electrónico (opcional)" name="email" type="email" autoComplete="section-buyer email" maxLength={254} value={form.email} onChange={event => change('email', event.target.value)} error={errors.email} hint="El pago se coordina por WhatsApp; no se envían correos automáticos." />
          </>}
          {step === 2 && <>
            <p className="text-sm text-muted">Todos los regalos del pedido se entregan juntos, en una dirección y franja. La entrega queda sujeta a confirmación.</p>
            <Input label="Nombre de quien recibe" name="recipientName" autoComplete="section-recipient name" required maxLength={100} value={form.recipientName} onChange={event => change('recipientName', event.target.value)} error={errors.recipientName} />
            <Input label="Teléfono de quien recibe" name="recipientPhone" type="tel" autoComplete="section-recipient tel" required maxLength={24} value={form.recipientPhone} onChange={event => change('recipientPhone', event.target.value)} error={errors.recipientPhone} />
            <Select label="Zona de entrega" name="zoneId" required value={form.zoneId} onChange={event => change('zoneId', event.target.value)} error={errors.zoneId}><option value="">Selecciona tu zona</option>{deliveryZones.map(zone => <option key={zone.id} value={zone.id}>{zone.name} · {subtotal >= zone.freeFrom ? 'envío gratis' : formatPrice(zone.fee)}</option>)}</Select>
            <Input label="Dirección" name="address" autoComplete="section-recipient street-address" required maxLength={300} value={form.address} onChange={event => change('address', event.target.value)} error={errors.address} />
            <Input label="Referencias (opcional)" name="references" maxLength={300} value={form.references} onChange={event => change('references', event.target.value)} error={errors.references} />
            <Select label="Fecha de entrega" name="date" required value={form.date} onChange={event => change('date', event.target.value)} error={errors.date}><option value="">Selecciona una fecha</option>{dates.map(date => <option key={date.value} value={date.value} disabled={!date.available}>{date.label}{!date.available ? ' · no disponible' : ''}</option>)}</Select>
            <Select label="Franja horaria" name="slotId" required value={form.slotId} onChange={event => change('slotId', event.target.value)} error={errors.slotId}><option value="">Selecciona una franja</option>{slots.map(slot => <option key={slot.id} value={slot.id}>{slot.label}</option>)}</Select>
            <Textarea label="Notas para la entrega (opcional)" name="notes" maxLength={500} value={form.notes} onChange={event => change('notes', event.target.value)} />
          </>}
          {step === 3 && <>
            <div className="bg-ivory/50 rounded-lg p-5 text-sm space-y-3 break-words">
              <div><p className="font-medium">Envía</p><p>{form.buyerName} · {form.phone}</p>{form.email && <p>{form.email}</p>}<Button variant="link" onClick={() => setStep(1)}>Editar tus datos</Button></div>
              <div><p className="font-medium">Recibe</p><p>{form.recipientName} · {form.recipientPhone}</p><p>{form.address} · {zone?.name}</p>{form.references && <p>Referencias: {form.references}</p>}<p>{dates.find(date => date.value === form.date)?.label} · {slots.find(slot => slot.id === form.slotId)?.label || 'Franja vencida: elige otra'}</p>{form.notes && <p className="whitespace-pre-wrap">Notas: {form.notes}</p>}<Button variant="link" onClick={() => setStep(2)}>Editar entrega</Button></div>
            </div>
            <fieldset className="space-y-3"><legend className="text-sm font-medium mb-3">¿Cómo prefieres pagar?</legend>{[{ id: 'qr', label: 'QR' }, { id: 'transfer', label: 'Transferencia bancaria' }].map(method => <label key={method.id} className="min-h-12 flex items-center gap-3 border border-line rounded-sm p-4"><input type="radio" name="method" value={method.id} checked={form.method === method.id} onChange={event => change('method', event.target.value)} />{method.label}</label>)}</fieldset>
            <p className="text-sm text-muted">Guardaremos tu pedido como pendiente de pago. Después podrás escribirnos por WhatsApp para recibir los datos de pago y confirmar la entrega.</p>
          </>}
          {error && <p role="alert" className="border-l-2 border-forest pl-3 text-sm font-medium">{error}</p>}
          <div className="border-t border-line pt-5 space-y-3">
            <p className="font-medium" aria-live="polite">{totalLabel}</p>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
              {step > 1 && <Button variant="secondary" onClick={() => { setStep(current => current - 1); setError(''); setErrors({}); }}>Atrás</Button>}
              <Button type="submit" disabled={busy || lines.length !== items.length} className="sm:ml-auto">{busy ? <><Loader2 size={16} className="animate-spin" />Guardando…</> : step === 3 ? 'Confirmar pedido pendiente de pago' : <>Continuar<ArrowRight size={16} /></>}</Button>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
    <aside className="hidden lg:block lg:sticky lg:top-28 self-start border border-line rounded-lg p-6"><h2 className="font-serif text-xl mb-5">Tu pedido</h2>{summaryContent}</aside>
  </div>;
}
