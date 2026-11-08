import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminCookie, validSession } from '@/lib/server/admin';
import { orderStatuses } from '@/lib/orders';
import { updateOrder } from '@/lib/server/order-store';
export async function PATCH(req: Request) {
  if (!validSession(cookies().get(adminCookie)?.value)) return NextResponse.json({ error: 'Inicia sesión nuevamente.' }, { status: 401 });
  const origin = req.headers.get('origin');
  if (origin && origin !== new URL(req.url).origin) return new NextResponse(null, { status: 403 });
  const parsed = z.object({ id: z.string().max(80), status: z.enum(orderStatuses) }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Estado inválido.' }, { status: 400 });
  try {
    const order = updateOrder(parsed.data.id, parsed.data.status);
    return order ? NextResponse.json({ ok: true }) : NextResponse.json({ error: 'Pedido no encontrado.' }, { status: 404 });
  } catch { return NextResponse.json({ error: 'No se pudo actualizar el pedido.' }, { status: 503 }); }
}
