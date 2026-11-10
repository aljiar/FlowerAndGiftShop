import type { OrderStatus } from './orders';

export const orderStages: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'delivered'];
export const orderMessages: Record<OrderStatus, { title: string; description: string; action: string }> = {
  pending: { title: 'Recibimos tu pedido.', description: 'Está registrado y pendiente de pago. Solicita el QR o los datos de transferencia por WhatsApp y confirma los detalles de entrega. El negocio verifica el pago manualmente.', action: 'Coordinar pago y entrega' },
  confirmed: { title: 'Pago confirmado.', description: 'El negocio marcó el pago como confirmado. Consulta por WhatsApp si necesitas aclarar la composición o los detalles de entrega.', action: 'Consultar mi entrega' },
  preparing: { title: 'Tu pedido está en preparación.', description: 'El negocio está preparando tu regalo. Para consultar la entrega o solicitar un cambio, escríbenos con el número de pedido.', action: 'Consultar mi pedido' },
  delivered: { title: 'Pedido marcado como entregado.', description: 'El negocio registró la entrega. Si necesitas comentar un detalle o reportar un inconveniente, contáctanos con tu número de pedido.', action: 'Consultar sobre mi entrega' },
  cancelled: { title: 'Pedido cancelado.', description: 'El negocio marcó este pedido como cancelado. Consulta por WhatsApp las condiciones aplicables a tu caso. Este estado no ejecuta ni confirma un reembolso.', action: 'Consultar mi cancelación' }
};

export function progressFor(status: OrderStatus) {
  const current = orderStages.indexOf(status);
  return orderStages.map((stage, index) => ({ stage, current: status === stage, complete: current > index }));
}
