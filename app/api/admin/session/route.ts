import { NextResponse } from 'next/server';
import { adminCookie, createSession, validPassword } from '@/lib/server/admin';
let windowStart = 0;
let attempts = 0;
export async function POST(req: Request) {
  const origin = req.headers.get('origin');
  if (origin && origin !== new URL(req.url).origin) return new NextResponse(null, { status: 403 });
  if (Date.now() - windowStart > 60000) { windowStart = Date.now(); attempts = 0; }
  if (++attempts > 20) return NextResponse.json({ error: 'Demasiados intentos. Espera un minuto.' }, { status: 429, headers: { 'Retry-After': '60' } });
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Datos inválidos.' }, { status: 400 }); }
  if (!validPassword(typeof body?.password === 'string' ? body.password : '')) return NextResponse.json({ error: 'Clave incorrecta o acceso sin configurar.' }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(adminCookie, createSession(), { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 28800 });
  return res;
}
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(adminCookie, '', { path: '/', maxAge: 0 });
  return res;
}
