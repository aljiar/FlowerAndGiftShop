import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CheckCircle2 } from 'lucide-react';
import { getOrder } from '@/lib/server/order-store';
import { statusLabels } from '@/lib/orders';
import { formatDateEs, formatPrice } from '@/lib/format';
import { whatsappLink } from '@/lib/constants';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Tu pedido', robots: { index: false, follow: false }, referrer: 'no-referrer' };
export default function ConfirmacionPage({ searchParams }: { searchParams: { id?: string; token?: string } }) {
  const order = searchParams.id && searchParams.token ? getOrder(searchParams.id) : undefined;
  if (!order || order.accessToken !== searchParams.token) notFound();
  return <div className="container py-section max-w-2xl">
    <CheckCircle2 className="text-sage mb-5" size={36} />
    <span className="eyebrow mb-3">{statusLabels[order.status]}</span>
    <h1 className="font-serif text-3xl sm:text-4xl mb-4">{order.status === 'pending' ? 'Recibimos tu pedido.' : 'Estado de tu pedido'}</h1>
    <p className="text-muted leading-relaxed">{order.status === 'pending' ? 'Tu pedido quedó guardado y está pendiente de pago. Escríbenos por WhatsApp para recibir el QR o los datos de transferencia y confirmar la entrega.' : 'Aquí puedes consultar el estado actualizado de tu pedido.'}</p>
    <p className="font-mono text-xs break-all mt-5">{order.id}</p>
    <div className="border-y border-line my-6 py-5 space-y-4">
      {order.items.map((item, i) => <div key={i}><div className="flex justify-between gap-4 text-sm"><span>{item.qty} × {item.name} · {item.variant}</span><span className="shrink-0">{formatPrice(item.subtotal)}</span></div>{item.message && <p className="text-xs text-muted mt-1 whitespace-pre-wrap">Tarjeta: {item.message}</p>}</div>)}
      <p className="text-sm">Envío: {formatPrice(order.totals.deliveryFee)}</p><p className="font-serif text-2xl">Total: {formatPrice(order.totals.total)}</p>
    </div>
    <div className="text-sm space-y-2 mb-7"><p>Para: {order.delivery.recipientName}</p><p>{order.delivery.address} · {order.delivery.zoneName}</p><p>{formatDateEs(order.delivery.date)} · {order.delivery.slotLabel}</p><p>Método: {order.payment.method === 'qr' ? 'QR' : 'Transferencia bancaria'}</p></div>
    <a className="inline-flex bg-forest text-cream px-6 py-4 text-sm rounded-sm" href={whatsappLink(`Hola, quiero coordinar el pago y la entrega del pedido ${order.id}, por ${formatPrice(order.totals.total)}.`)} target="_blank" rel="noreferrer">Coordinar por WhatsApp</a>
    <p className="text-xs text-muted mt-4">Guarda este enlace para consultar tu pedido. No lo compartas: permite ver sus detalles.</p>
    <Link href="/coleccion" className="inline-block text-sm underline mt-7">Seguir explorando</Link>
  </div>;
}
