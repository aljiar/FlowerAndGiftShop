'use client';
import { Minus, Plus } from 'lucide-react';

export function QuantityControl({ value, onChange, label }: { value: number; onChange: (value: number) => void; label: string }) {
  return <div className="inline-flex items-center border border-line rounded-sm shrink-0" role="group" aria-label={`Cantidad de ${label}`}>
    <button type="button" disabled={value <= 1} aria-label={`Reducir cantidad de ${label}`} onClick={() => onChange(value - 1)} className="w-11 h-11 inline-flex items-center justify-center hover:bg-ivory disabled:opacity-40"><Minus size={16} aria-hidden="true" /></button>
    <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">{value}</span>
    <button type="button" disabled={value >= 99} aria-label={`Aumentar cantidad de ${label}`} onClick={() => onChange(value + 1)} className="w-11 h-11 inline-flex items-center justify-center hover:bg-ivory disabled:opacity-40"><Plus size={16} aria-hidden="true" /></button>
  </div>;
}
