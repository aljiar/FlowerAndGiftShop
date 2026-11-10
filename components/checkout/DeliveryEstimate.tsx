'use client';
import { useState } from 'react';
import { deliveryZones, commerceReady } from '@/lib/constants';
import { formatPrice } from '@/lib/format';
import { Select } from '@/components/ui/Field';

export function DeliveryEstimate({ subtotal }: { subtotal: number }) {
  const [zoneId, setZoneId] = useState('');
  const zone = deliveryZones.find(item => item.id === zoneId);
  if (!commerceReady) return <p className="text-sm text-muted">Entrega a coordinar por WhatsApp. Confirma cobertura y costo antes de pagar.</p>;
  const fee = zone ? subtotal >= zone.freeFrom ? 0 : zone.fee : null;
  return <div className="space-y-3">
    <Select label="Estima tu entrega" value={zoneId} onChange={event => setZoneId(event.target.value)}>
      <option value="">Selecciona tu zona</option>{deliveryZones.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
    </Select>
    {fee !== null && <p className="text-sm" role="status">Envío: {fee === 0 ? 'Gratis' : formatPrice(fee)} · Total estimado: {formatPrice(subtotal + fee)}</p>}
    <p className="text-xs text-muted">El importe se recalcula al cambiar la cantidad o la zona. Confirma fecha y dirección al finalizar.</p>
  </div>;
}
