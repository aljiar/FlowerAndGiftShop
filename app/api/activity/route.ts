import { NextResponse } from 'next/server';
import { activityEnabled, activitySchema } from '@/lib/activity';
import { recordActivity } from '@/lib/server/activity-store';
import { isSameOrigin } from '@/lib/server/request-origin';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!activityEnabled) return new NextResponse(null, { status: 204 });
  if (request.headers.get('dnt') === '1' || request.headers.get('sec-gpc') === '1') return new NextResponse(null, { status: 204 });
  if (!isSameOrigin(request)) return new NextResponse(null, { status: 403 });
  if (!request.headers.get('content-type')?.includes('application/json')) return new NextResponse(null, { status: 415 });
  if (Number(request.headers.get('content-length')) > 1024) return new NextResponse(null, { status: 413 });
  let value;
  try {
    const body = await request.text();
    if (body.length > 1024) return new NextResponse(null, { status: 413 });
    value = JSON.parse(body);
  } catch { return new NextResponse(null, { status: 400 }); }
  const parsed = activitySchema.safeParse(value);
  if (!parsed.success) return new NextResponse(null, { status: 400 });
  try { recordActivity(parsed.data); return new NextResponse(null, { status: 204, headers: { 'Cache-Control': 'no-store' } }); }
  catch { return new NextResponse(null, { status: 503 }); }
}
