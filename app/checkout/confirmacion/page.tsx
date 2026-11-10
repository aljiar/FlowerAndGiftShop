import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { getOrder } from '@/lib/server/order-store';
import { statusLabels } from '@/lib/orders';
import { orderMessages, progressFor } from '@/lib/order-progress';
import { RefreshOrderButton } from '@/components/checkout/RefreshOrderButton';
import { formatDateEs, formatPrice } from '@/lib/format';
import { whatsappLink } from '@/lib/constants';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Tu pedido', robots: { index: false, follow: false }, referrer: 'no-referrer' };

export default function ConfirmacionPage({ searchParams }: { searchParams: { id?: string; token?: string } }) {
  if (!searchParams.id || !searchParams.token) notFound();
  let order;
  try { order = getOrder(searchParams.id); } catch {
    return <div className="container py-section max-w-2xl"><h1 className="font-serif text-3xl mb-5">No pudimos consultar tu pedido.</h1><p role="alert" className="text-muted mb-6">Inténtalo de nuevo en unos momentos. Conserva tu enlace privado.</p><RefreshOrderButton /></div>;
  }
  if (!order || order.accessToken !== searchParams.token) notFound();
  const message = orderMessages[order.status];
  const Icon = order.status === 'cancelled' ? XCircle : order.status === 'delivered' ? CheckCircle2 : Clock;
  const contactText = order.status === 'pending' ? `Hola, quiero coordinar el pago y la entrega del pedido ${order.id}, por ${formatPrice(order.totals.total)}.` : `Hola, quiero consultar sobre el pedido ${order.id}, con estado ${statusLabels[order.status]}.`;
  return <div className="container py-10 md:py-section max-w-3xl">
    <Icon className="text-forest mb-5" size={36} aria-hidden="true" />
    <p className="eyebrow mb-3">{statusLabels[order.status]}</p>
    <h1 className="font-serif text-3xl sm:text-4xl mb-4">{message.title}</h1>
    <p className="text-muted leading-relaxed">{message.description}</p>
    <p className="font-mono text-xs break-all mt-5">{order.id}</p>
    <div className="mt-5"><RefreshOrderButton /><p className="text-sm text-muted mt-2">El estado lo actualiza el negocio. Pulsa «Actualizar estado» para consultarlo de nuevo.</p></div>
    {order.status !== 'cancelled' && <ol className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8" aria-label="Etapas del pedido">{progressFor(order.status).map(item => <li key={item.stage} aria-current={item.current ? 'step' : undefined} className={`border-t-2 pt-3 text-sm ${item.current || item.complete ? 'border-forest text-forest' : 'border-line text-muted'}`}><span className={item.current ? 'font-semibold' : ''}>{statusLabels[item.stage]}</span>{item.current && <span className="block text-xs mt-1">Estado actual</span>}</li>)}</ol>}
    <section className="border-y border-line my-8 py-6 space-y-4" aria-labelledby="order-summary">
      <h2 id="order-summary" className="font-serif text-2xl">Resumen del pedido</h2>
      {order.items.map((item, index) => <div key={index}><div className="flex flex-wrap justify-between gap-2 text-sm"><span>{item.qty} × {item.name} · {item.variant}</span><span className="shrink-0">{formatPrice(item.subtotal)}</span></div>{item.message && <p className="text-sm text-muted mt-2 whitespace-pre-wrap break-words">Tarjeta: {item.message}</p>}</div>)}
      <dl className="space-y-2"><div className="flex justify-between text-sm"><dt>Entrega</dt><dd>{formatPrice(order.totals.deliveryFee)}</dd></div><div className="flex justify-between font-serif text-2xl"><dt>Total</dt><dd>{formatPrice(order.totals.total)}</dd></div></dl>
    </section>
    <section className="text-sm space-y-3 mb-7 break-words" aria-labelledby="order-delivery"><h2 id="order-delivery" className="font-serif text-2xl">Datos de entrega</h2><p>Para: {order.delivery.recipientName}</p><p>{order.delivery.address} · {order.delivery.zoneName}</p>{order.delivery.references && <p>Referencias: {order.delivery.references}</p>}<p>{formatDateEs(order.delivery.date)} · {order.delivery.slotLabel}</p>{order.notes && <p className="whitespace-pre-wrap">Notas: {order.notes}</p>}<p>Método elegido: {order.payment.method === 'qr' ? 'QR' : 'Transferencia bancaria'}</p></section>
    <a className="inline-flex min-h-12 items-center justify-center bg-forest text-cream px-5 py-3 text-sm rounded-sm" href={whatsappLink(contactText)} target="_blank" rel="noreferrer">{message.action}</a>
    <p className="text-sm text-muted mt-4">Guarda este enlace privado. No lo compartas: permite ver los datos de este pedido. La web no envía mensajes de WhatsApp ni correos automáticos.</p>
    <div className="flex flex-wrap gap-4 mt-5"><Link href="/como-comprar#seguimiento" className="inline-flex items-center min-h-11 text-sm underline">Ayuda con el seguimiento</Link><Link href="/coleccion" className="inline-flex items-center min-h-11 text-sm underline">Seguir explorando</Link></div>
  </div>;
}
