import { checkoutSchema } from './orders';
import { availableSlots } from './delivery';
import { deliveryZones } from './constants';

export const draftKey = 'norahs-garden-checkout-v1';
export const initialCheckoutForm = {
  buyerName: '', email: '', phone: '', recipientName: '', recipientPhone: '', zoneId: '', address: '',
  references: '', date: '', slotId: '', notes: '', method: 'qr' as 'qr' | 'transfer'
};
export type CheckoutFormData = typeof initialCheckoutForm;
export type CheckoutErrors = Partial<Record<keyof CheckoutFormData, string>>;
export type Draft = { form: CheckoutFormData; step: number };
type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export function checkoutPayload(form: CheckoutFormData) {
  return {
    buyer: { name: form.buyerName, email: form.email, phone: form.phone },
    delivery: { recipientName: form.recipientName, recipientPhone: form.recipientPhone, zoneId: form.zoneId, address: form.address, references: form.references, date: form.date, slotId: form.slotId },
    notes: form.notes, payment: { method: form.method }
  };
}

export function checkoutErrors(form: CheckoutFormData, step: number, now = new Date()): CheckoutErrors {
  const data = checkoutPayload(form);
  const parsed = step === 1 ? checkoutSchema.shape.buyer.safeParse(data.buyer) : checkoutSchema.shape.delivery.safeParse(data.delivery);
  const errors: CheckoutErrors = {};
  const names: Record<string, keyof CheckoutFormData> = step === 1 ? { name: 'buyerName', email: 'email', phone: 'phone' } : {
    recipientName: 'recipientName', recipientPhone: 'recipientPhone', zoneId: 'zoneId', address: 'address', references: 'references', date: 'date', slotId: 'slotId'
  };
  const messages: CheckoutErrors = {
    buyerName: 'Escribe el nombre de quien envía.', email: 'Escribe un correo válido o deja este campo vacío.', phone: 'Escribe un teléfono válido de al menos 7 dígitos.',
    recipientName: 'Escribe el nombre de quien recibe.', recipientPhone: 'Escribe un teléfono válido de al menos 7 dígitos.',
    address: 'Escribe una dirección de al menos 5 caracteres.', references: 'Usa hasta 300 caracteres.',
    zoneId: 'Selecciona una zona.', date: 'Selecciona una fecha disponible.', slotId: 'Selecciona una franja disponible.'
  };
  if (!parsed.success) for (const issue of parsed.error.issues) {
    const field = names[String(issue.path[0])];
    if (field) errors[field] = messages[field];
  }
  if (step === 2) {
    if (!deliveryZones.some(zone => zone.id === form.zoneId)) errors.zoneId = messages.zoneId;
    const slots = availableSlots(form.date, now);
    if (!slots.length) errors.date = 'Esta fecha ya no está disponible. Elige otra.';
    else if (!slots.some(slot => slot.id === form.slotId)) errors.slotId = 'Esta franja ya no está disponible. Elige otra.';
  }
  return errors;
}

export function readCheckoutDraft(storage?: StorageLike, now = Date.now()): Draft {
  const empty = () => ({ form: { ...initialCheckoutForm }, step: 1 });
  try {
    const raw = storage?.getItem(draftKey);
    if (!raw) return empty();
    const saved = JSON.parse(raw);
    if (saved.version !== 1 || !Number.isFinite(saved.savedAt) || now - saved.savedAt > 2 * 60 * 60 * 1000 || saved.savedAt > now || !saved.form || typeof saved.form !== 'object') {
      storage?.removeItem(draftKey);
      return empty();
    }
    const form = { ...initialCheckoutForm };
    const limits: Record<keyof CheckoutFormData, number> = { buyerName: 100, email: 254, phone: 24, recipientName: 100, recipientPhone: 24, zoneId: 40, address: 300, references: 300, date: 10, slotId: 20, notes: 500, method: 8 };
    for (const key of Object.keys(form) as Array<keyof CheckoutFormData>) {
      if (key !== 'method' && typeof saved.form[key] === 'string') form[key] = saved.form[key].slice(0, limits[key]);
    }
    if (saved.form.method === 'transfer') form.method = 'transfer';
    if (!deliveryZones.some(zone => zone.id === form.zoneId)) form.zoneId = '';
    let step = saved.step === 2 || saved.step === 3 ? saved.step : 1;
    if (Object.keys(checkoutErrors(form, 1, new Date(now))).length) step = 1;
    else if (step === 3 && Object.keys(checkoutErrors(form, 2, new Date(now))).length) step = 2;
    return { form, step };
  } catch { return empty(); }
}

export function saveCheckoutDraft(storage: StorageLike | undefined, draft: Draft, now = Date.now()) {
  try { storage?.setItem(draftKey, JSON.stringify({ version: 1, savedAt: now, ...draft })); } catch { /* El formulario sigue disponible en memoria. */ }
}
export function clearCheckoutDraft(storage?: StorageLike) {
  try { storage?.removeItem(draftKey); } catch { /* El navegador puede restringir el almacenamiento. */ }
}
