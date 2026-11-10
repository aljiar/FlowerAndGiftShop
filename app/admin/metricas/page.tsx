import { cookies } from 'next/headers';
import Link from 'next/link';
import type { Metadata } from 'next';
import { adminCookie, validSession } from '@/lib/server/admin';
import { readActivity } from '@/lib/server/activity-store';
import { activityEnabled } from '@/lib/activity';
import { AdminLogin } from '@/components/admin/AdminControls';
import { MetricsDashboard } from '@/components/admin/MetricsDashboard';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Métricas de actividad', robots: { index: false, follow: false }, referrer: 'no-referrer' };

export default function MetricsPage({ searchParams }: { searchParams: { mode?: string; period?: string } }) {
  if (!validSession(cookies().get(adminCookie)?.value)) return <div className="container py-section"><h1 className="font-serif text-3xl text-center mb-8">Métricas de la tienda</h1><AdminLogin /></div>;
  const mode = searchParams.mode === 'preview' ? 'preview' : 'live';
  const period = searchParams.period === '7' ? 7 : 30;
  try { return <MetricsDashboard enabled={activityEnabled} period={period} summary={readActivity(mode, period)} />; }
  catch { return <div className="container py-section"><h1 className="font-serif text-3xl mb-5">Métricas de actividad</h1><p role="alert">No pudimos consultar las métricas. La gestión de pedidos sigue disponible.</p><Link href="/admin/pedidos" className="inline-flex min-h-11 items-center underline mt-4">Ir a pedidos</Link></div>; }
}
