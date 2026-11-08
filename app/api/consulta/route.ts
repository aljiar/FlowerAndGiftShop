import { NextResponse } from 'next/server';
import { z } from 'zod';
import { saveInquiry } from '@/lib/server/order-store';

const schema = z.object({
  name: z.string().trim().min(2).max(100), email: z.string().email().max(254), phone: z.string().trim().min(7).max(24),
  eventType: z.enum(['boda', 'corporativo', 'celebracion', 'otro']), date: z.string().max(10),
  guests: z.string().max(20), budget: z.string().max(30), message: z.string().max(3000)
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Revisa los datos de la consulta.' }, { status: 400 });
    saveInquiry(parsed.data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'No se pudo guardar la consulta.' }, { status: 503 });
  }
}
