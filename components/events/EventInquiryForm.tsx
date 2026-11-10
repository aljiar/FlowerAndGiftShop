'use client';

import { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Input, Select, Textarea } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { whatsappLink, site } from '@/lib/constants';

export function EventInquiryForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [eventType, setEventType] = useState('boda');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState('');
  const [budget, setBudget] = useState('');
  const [message, setMessage] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    const payload = { name, email, phone, eventType, date, guests, budget, message };
    try {
      const response = await fetch('/api/consulta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('No pudimos guardar tu consulta. Revisa los datos e inténtalo otra vez.');
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No pudimos conectar. Inténtalo otra vez.');
    } finally { setBusy(false); }
  };

  if (done) {
    return (
      <div className="border border-line rounded-sm p-8 bg-cream">
        <div className="flex items-center gap-3 text-sage mb-3">
          <Check size={18} strokeWidth={1.5} />
          <p className="font-serif text-lg">Consulta enviada.</p>
        </div>
        <p className="text-sm text-muted leading-relaxed">
          Tu consulta quedó registrada para revisión manual. La disponibilidad aún debe confirmarse. Si prefieres, escríbenos
          directamente a{' '}
          <a href={whatsappLink('Hola, quiero consultar sobre un evento.')} className="text-clay underline">
            {site.whatsapp}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5 border border-line rounded-sm p-7 bg-cream">
      <div className="grid sm:grid-cols-2 gap-3">
        <Input label="Nombre" name="name" required value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Teléfono" name="phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+591 7XXXXXXX" />
      </div>
      <Input label="Correo" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <div className="grid sm:grid-cols-2 gap-3">
        <Select label="Tipo de evento" name="eventType" value={eventType} onChange={(e) => setEventType(e.target.value)}>
          <option value="boda">Boda</option>
          <option value="corporativo">Evento corporativo</option>
          <option value="celebracion">Cumpleaños / Aniversario</option>
          <option value="otro">Otro</option>
        </Select>
        <Input label="Fecha tentativa" name="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Input label="Cantidad de invitados (aprox.)" name="guests" value={guests} onChange={(e) => setGuests(e.target.value)} placeholder="Ej. 80" />
        <Select label="Presupuesto estimado" name="budget" value={budget} onChange={(e) => setBudget(e.target.value)}>
          <option value="">Prefiero conversar</option>
          <option value="500-1500">Bs 500 – 1.500</option>
          <option value="1500-3000">Bs 1.500 – 3.000</option>
          <option value="3000-6000">Bs 3.000 – 6.000</option>
          <option value="6000+">Más de Bs 6.000</option>
        </Select>
      </div>
      <Textarea
        label="Contanos sobre el evento"
        name="message"
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Paleta, lugar, ideas, referencias…"
      />
      {error && <p role="alert" className="text-sm text-clay">{error}</p>}
      <Button type="submit" fullWidth size="lg" disabled={busy}>
        {busy ? 'Guardando…' : 'Enviar consulta'} <ArrowRight size={14} strokeWidth={1.5} />
      </Button>
      <p className="text-xs text-muted text-center">
        Enviar una consulta no confirma disponibilidad ni contrata un servicio.
      </p>
    </form>
  );
}
