import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { adminCookie, validSession } from '@/lib/server/admin';
import { listOrders, listInquiries } from '@/lib/server/order-store';
import { AdminLogin, AdminLogout, OrderStatusControl } from '@/components/admin/AdminControls';
import { formatDateEs, formatPrice } from '@/lib/format';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Gestión de pedidos', robots: { index: false, follow: false } };
export default function AdminOrdersPage() {
  const authenticated = validSession(cookies().get(adminCookie)?.value);
  if (!authenticated) return <div className="container py-section"><h1 className="font-serif text-3xl mb-8 text-center">Administración de pedidos</h1><AdminLogin /></div>;
  let orders, inquiries;
  try { orders = listOrders(); inquiries = listInquiries(); } catch { return <div className="container py-section" role="alert">No se pudo abrir la base de pedidos. Revisa la configuración del servidor.</div>; }
  return <div className="container py-section">
    <header className="flex flex-wrap items-center justify-between gap-5 mb-8"><div><h1 className="font-serif text-3xl">Pedidos</h1><p className="text-sm text-muted mt-2">Últimos 200 pedidos. Actualiza la página para recibir nuevos.</p></div><AdminLogout /></header>
    {!orders.length && <p>Todavía no hay pedidos.</p>}
    <div className="space-y-6">{orders.map(order => <article key={order.id} className="border border-line p-5 sm:p-7 rounded-sm space-y-5">
      <div className="flex flex-wrap justify-between gap-4"><div><h2 className="font-mono text-xs break-all">{order.id}</h2><p className="text-sm text-muted mt-1">{new Date(order.createdAt).toLocaleString('es-BO', { timeZone: 'America/La_Paz' })}</p></div><OrderStatusControl id={order.id} status={order.status} /></div>
      <div className="grid md:grid-cols-2 gap-5 text-sm"><div><h3 className="font-medium mb-2">Comprador</h3><p>{order.buyer.name}</p><p>{order.buyer.phone}</p><p className="break-all">{order.buyer.email}</p></div>
      <div><h3 className="font-medium mb-2">Entrega · {formatDateEs(order.delivery.date)} · {order.delivery.slotLabel}</h3><p>{order.delivery.recipientName} · {order.delivery.recipientPhone}</p><p>{order.delivery.address} · {order.delivery.zoneName}</p><p>{order.delivery.references}</p><p>{order.notes}</p></div></div>
      <ul className="space-y-3 text-sm">{order.items.map((item, i) => <li key={i} className="border-t border-line pt-3"><p>{item.qty} × {item.name} · {item.variant} · {formatPrice(item.subtotal)}</p>{item.message && <p className="text-muted mt-1 whitespace-pre-wrap">Tarjeta: {item.message}</p>}</li>)}</ul>
      <p className="font-medium">Total: {formatPrice(order.totals.total)} · Envío: {formatPrice(order.totals.deliveryFee)} · {order.payment.method === 'qr' ? 'QR' : 'Transferencia'}</p>
    </article>)}</div>
    <h2 className="font-serif text-2xl mt-12 mb-5">Consultas de eventos</h2>
    {!inquiries.length && <p className="text-sm text-muted">Todavía no hay consultas.</p>}
    <div className="space-y-4">{inquiries.map(inquiry => <article key={inquiry.id} className="border border-line p-5 text-sm space-y-2"><h3 className="font-medium">{inquiry.name} · {inquiry.eventType}</h3><p>{inquiry.email} · {inquiry.phone}</p><p>Fecha: {inquiry.date || 'Por definir'} · Invitados: {inquiry.guests || 'Por definir'} · Presupuesto: {inquiry.budget || 'Por definir'}</p><p className="whitespace-pre-wrap">{inquiry.message}</p></article>)}</div>
  </div>;
}
