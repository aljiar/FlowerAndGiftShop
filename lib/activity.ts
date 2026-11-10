import { z } from 'zod';
import { products } from './catalog';
import { occasions } from './occasions';

export const activityEnabled = process.env.NEXT_PUBLIC_METRICS_ENABLED === 'true';
export const activitySources = ['home', 'catalog', 'occasion', 'product', 'cart', 'checkout', 'guide', 'contact', 'about', 'events', 'order'] as const;
export const publicActivityEvents = ['product_view', 'cart_add', 'cart_view', 'checkout_view', 'checkout_started', 'delivery_view', 'review_view', 'whatsapp_click'] as const;
export const activityEvents = [...publicActivityEvents, 'order_created'] as const;
export type ActivityEvent = typeof activityEvents[number];
export type ActivitySource = typeof activitySources[number];
export type ActivityMode = 'preview' | 'live';
export const activityLabels: Record<ActivityEvent, string> = {
  product_view: 'Vistas de producto', cart_add: 'Acciones de añadir', cart_view: 'Vistas del carrito',
  checkout_view: 'Vistas de revisión del pedido', checkout_started: 'Datos del comprador', delivery_view: 'Paso de entrega',
  review_view: 'Paso de confirmación', whatsapp_click: 'Clics en WhatsApp', order_created: 'Pedidos registrados'
};
const productId = z.string().max(100).refine(value => products.some(product => product._id === value), 'Producto desconocido');
export const activitySchema = z.object({ event: z.enum(publicActivityEvents), source: z.enum(activitySources), productId: productId.optional() }).strict().superRefine((value, context) => {
  const productEvent = value.event === 'product_view' || value.event === 'cart_add';
  if (productEvent && !value.productId) context.addIssue({ code: 'custom', message: 'Falta producto.' });
  if (!productEvent && value.productId) context.addIssue({ code: 'custom', message: 'Este evento no recibe producto.' });
  if (value.event === 'product_view' && value.source !== 'product') context.addIssue({ code: 'custom', message: 'Origen inválido.' });
  if (value.event === 'cart_add' && !['home', 'catalog', 'occasion', 'product'].includes(value.source)) context.addIssue({ code: 'custom', message: 'Origen inválido.' });
  if (value.event === 'cart_view' && value.source !== 'cart') context.addIssue({ code: 'custom', message: 'Origen inválido.' });
  if (['checkout_view', 'checkout_started', 'delivery_view', 'review_view'].includes(value.event) && value.source !== 'checkout') context.addIssue({ code: 'custom', message: 'Origen inválido.' });
});
export type PublicActivity = z.infer<typeof activitySchema>;

export function activityPage(pathname: string): { source: ActivitySource; view?: PublicActivity } | undefined {
  const paths: Record<string, ActivitySource> = { '/': 'home', '/coleccion': 'catalog', '/carrito': 'cart', '/checkout': 'checkout', '/como-comprar': 'guide', '/contacto': 'contact', '/nosotros': 'about', '/eventos': 'events', '/checkout/confirmacion': 'order' };
  const source = paths[pathname];
  if (source) return { source, view: source === 'cart' ? { event: 'cart_view', source } : source === 'checkout' ? { event: 'checkout_view', source } : undefined };
  const product = products.find(product => pathname === `/producto/${product.slug}`);
  if (product) return { source: 'product', view: { event: 'product_view', source: 'product', productId: product._id } };
  if (occasions.some(occasion => pathname === `/ocasion/${occasion.slug}`)) return { source: 'occasion' };
}

export interface ActivitySummary {
  from: string; to: string; mode: ActivityMode;
  totals: Record<ActivityEvent, number>;
  daily: Array<{ day: string; productViews: number; adds: number; whatsapp: number }>;
  products: Array<{ id: string; views: number; adds: number }>;
}
export function activityInsights(summary: ActivitySummary): string[] {
  const totals = summary.totals;
  if (!Object.values(totals).some(Boolean)) return ['Aún no hay actividad en este período. Reúne datos antes de cambiar el catálogo o añadir complementos.'];
  const notes: string[] = [];
  if (totals.product_view >= 20 && totals.cart_add === 0) notes.push('Hay vistas de fichas y ninguna acción de añadir. Revisa fotos, composición, tamaños y precios antes de ampliar la oferta.');
  if (totals.checkout_view >= 10 && totals.whatsapp_click === 0) notes.push('Hay visitas a la revisión del pedido y ningún clic en WhatsApp registrado. Comprueba que el siguiente paso y la entrega sean claros.');
  if (totals.whatsapp_click > 0) notes.push('Hay clics en WhatsApp. Contrasta estas señales con las consultas recibidas para decidir qué complementos o combos preparar.');
  if (!notes.length) notes.push('La actividad aún es pequeña para priorizar cambios por volumen. Revisa las fichas más consultadas y las preguntas recibidas.');
  return notes;
}
