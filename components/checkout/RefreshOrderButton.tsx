'use client';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function RefreshOrderButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return <Button variant="secondary" disabled={pending} onClick={() => startTransition(() => router.refresh())}>{pending ? 'Consultando…' : 'Actualizar estado'}</Button>;
}
