'use client';
import { useEffect, useState } from 'react';
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
  const [selected, setSelected] = useState(status);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  useEffect(() => setSelected(status), [status]);
  return <form className="space-y-3 max-w-sm" onSubmit={async event => {
    event.preventDefault();
    if (busy || selected === status) return;
    setBusy(true); setError(''); setSaved(false);
    try {
      const response = await fetch('/api/admin/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: selected }) });
      if (!response.ok) throw new Error((await response.json()).error);
      setSaved(true); router.refresh();
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'No se pudo actualizar.'); }
    finally { setBusy(false); }
  }}>
    <label className="block text-sm font-medium" htmlFor={id}>Estado del pedido</label>
    <select id={id} aria-describedby={id + '-note'} value={selected} disabled={busy} className="block border border-line rounded-sm bg-cream min-h-11 p-3 text-base max-w-full" onChange={event => { setSelected(event.target.value as OrderStatus); setSaved(false); }}>
      {orderStatuses.map(value => <option key={value} value={value}>{statusLabels[value]}</option>)}
    </select>
    <p id={id + '-note'} className="text-sm text-muted">{selected === 'confirmed' ? 'Marca el pago solo después de verificarlo y confirmar los detalles de entrega.' : selected === 'cancelled' ? 'Cancelar el pedido no ejecuta un reembolso. Coordina cualquier importe o condición por separado.' : 'Guarda el estado después de comprobarlo. El cliente lo consulta desde su enlace privado; no se envían avisos automáticos.'}</p>
    <Button type="submit" disabled={busy || selected === status}>{busy ? 'Guardando…' : 'Guardar estado'}</Button>
    {saved && <p role="status" className="text-sm">Estado guardado.</p>}
    {error && <p role="alert" className="text-sm">{error}</p>}
  </form>;
}
