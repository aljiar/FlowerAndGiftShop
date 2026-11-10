import { z } from 'zod';
import { products } from './catalog';
import { deliveryZones, timeSlots } from './constants';
import { availableSlots } from './delivery';

const text = (min: number, max: number) => z.string().trim().min(min).max(max);
const phone = text(7, 24).regex(/^\+?[\d\s()-]+$/, 'Teléfono inválido').refine(value => value.replace(/\D/g, '').length >= 7, 'Teléfono incompleto');
export const checkoutSchema = z.object({
  requestId: z.string().uuid(),
  buyer: z.object({ name: text(2, 100), email: z.string().trim().email().max(254).or(z.literal('')).optional(), phone }),
  delivery: z.object({ recipientName: text(2, 100), recipientPhone: phone, zoneId: text(1, 40), address: text(5, 300), references: text(0, 300).optional(), date: text(10, 10), slotId: text(1, 20) }),
  notes: text(0, 500).optional(), payment: z.object({ method: z.enum(['qr', 'transfer']) }),
  items: z.array(z.object({ productId: text(1, 100), variantId: text(1, 100), qty: z.number().int().min(1).max(99), message: text(0, 180).optional() })).min(1).max(50)
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export const orderStatuses = ['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'] as const;
export type OrderStatus = typeof orderStatuses[number];
export const statusLabels: Record<OrderStatus, string> = { pending: 'Pendiente de pago', confirmed: 'Pago confirmado', preparing: 'En preparación', delivered: 'Entregado', cancelled: 'Cancelado' };
export type Order = ReturnType<typeof priceOrder> & { id: string; accessToken: string; createdAt: string; status: OrderStatus };
export function priceOrder(input: CheckoutInput, now = new Date()) {
  const zone = deliveryZones.find(z => z.id === input.delivery.zoneId);
  if (!zone) throw new Error('Selecciona una zona de entrega válida.');
  if (!availableSlots(input.delivery.date, now).some(s => s.id === input.delivery.slotId)) throw new Error('La fecha o franja ya no está disponible. Selecciona otra.');
  const items = input.items.map(item => {
    const product = products.find(p => p._id === item.productId);
    const variant = product?.variants.find(v => v.id === item.variantId);
    if (!product || !variant || !product.inStock) throw new Error('Uno de los arreglos ya no está disponible. Revisa tu carrito.');
    const unitPrice = product.basePrice + variant.priceDelta;
    return { ...item, name: product.name, variant: variant.label, unitPrice, subtotal: unitPrice * item.qty };
  });
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const deliveryFee = subtotal >= zone.freeFrom ? 0 : zone.fee;
  return { ...input, items, delivery: { ...input.delivery, zoneName: zone.name, slotLabel: timeSlots.find(s => s.id === input.delivery.slotId)!.label }, totals: { subtotal, deliveryFee, total: subtotal + deliveryFee } };
}
