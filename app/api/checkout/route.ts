import { NextResponse } from 'next/server';
import { checkoutSchema } from '@/lib/orders';
import { saveOrder } from '@/lib/server/order-store';
export const runtime = 'nodejs';
export async function POST(req: Request) {
  if (Number(req.headers.get('content-length')) > 65536) return NextResponse.json({ error: 'Pedido demasiado grande.' }, { status: 413 });
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'JSON inválido.' }, { status: 400 }); }
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Revisa los datos de contacto, entrega y productos.', issues: parsed.error.flatten() }, { status: 400 });
  try {
    const order = saveOrder(parsed.data);
    return NextResponse.json({ orderId: order.id, accessToken: order.accessToken, status: order.status, totals: order.totals }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (/Selecciona|disponible|intento ya/.test(message)) return NextResponse.json({ error: message }, { status: 409 });
    console.error('[checkout] No se pudo guardar el pedido:', error instanceof Error ? error.name : 'Error');
    return NextResponse.json({ error: 'No pudimos guardar tu pedido. Tu carrito se conserva; vuelve a intentarlo.' }, { status: 503 });
  }
}
