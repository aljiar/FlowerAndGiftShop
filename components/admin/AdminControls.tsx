'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import { orderStatuses, statusLabels, type OrderStatus } from '@/lib/orders';

export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState(''), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  return <form className="space-y-5 max-w-sm mx-auto" onSubmit={async e => {
    e.preventDefault(); setBusy(true); setError('');
    try {
      const response = await fetch('/api/admin/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
      if (!response.ok) throw new Error((await response.json()).error);
      setPassword(''); router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo ingresar.'); } finally { setBusy(false); }
  }}>
    <Input label="Clave de administración" name="password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} />
    {error && <p role="alert" className="text-sm text-clay">{error}</p>}
    <Button type="submit" fullWidth disabled={busy}>{busy ? 'Ingresando…' : 'Ingresar'}</Button>
  </form>;
}
export function AdminLogout() {
  const router = useRouter();
  return <Button variant="secondary" onClick={async () => { await fetch('/api/admin/session', { method: 'DELETE' }); router.refresh(); }}>Cerrar sesión</Button>;
}
export function OrderStatusControl({ id, status }: { id: string; status: OrderStatus }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  return <div className="space-y-2"><label className="text-xs" htmlFor={id}>Estado del pedido</label>
    <select id={id} value={status} disabled={busy} className="block border border-line bg-cream p-3 text-sm max-w-full" onChange={async e => {
      setBusy(true); setError('');
      try {
        const res = await fetch('/api/admin/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: e.target.value }) });
        if (!res.ok) throw new Error((await res.json()).error);
        router.refresh();
      } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo actualizar.'); } finally { setBusy(false); }
    }}>{orderStatuses.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}</select>
    {error && <p role="alert" className="text-clay text-sm">{error}</p>}
  </div>;
}
