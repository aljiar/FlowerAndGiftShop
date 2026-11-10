'use client';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
export function MetricsRefresh() {
  const router = useRouter();
  const [pending, start] = useTransition();
  return <Button variant="secondary" disabled={pending} onClick={() => start(() => router.refresh())}>{pending ? 'Consultando…' : 'Actualizar métricas'}</Button>;
}
