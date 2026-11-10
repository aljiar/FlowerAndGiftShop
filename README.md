# Norah's Garden · Florería en Cochabamba

MVP de tienda floral con Next.js, TypeScript, Tailwind, carrito persistente y checkout con pedidos guardados en SQLite.

## Estado comercial

Tienda en preparación. El catálogo es de ejemplo y los pedidos web están deshabilitados. Atención por WhatsApp confirmado: +591 74309070. Consulta [P0.md](P0.md) para datos validados y pendientes antes de habilitar ventas.

## Experiencia móvil y catálogo

Consulta [P1.md](P1.md) para categorías, filtros compartibles, compra móvil y borradores del checkout. P1 mantiene los pedidos bloqueados hasta completar los pendientes comerciales de P0.

## Ejecutar localmente

Requiere Node.js **22.13 o superior**; recomendado Node.js 24.

```powershell
npm.cmd install
npm.cmd run setup
npm.cmd run dev
```

Abre `http://localhost:3000`. La configuración privada se crea en `.env.local`; incluye `ADMIN_PASSWORD` para entrar en `/admin/pedidos`. El comando `setup` conserva archivos de configuración existentes.

## Flujo de compra

1. Explorar catálogo y variantes, y agregar arreglos al carrito.
2. Revisar cantidades y dedicatorias.
3. Completar comprador y destinatario, dirección y franja de entrega.
4. Confirmar: se guarda el pedido con total calculado por el servidor y estado **Pendiente de pago**.
5. Coordinar QR o transferencia desde el botón de WhatsApp de la confirmación.

El negocio consulta los pedidos y cambia sus estados en `/admin/pedidos`. También puede consultar las solicitudes de eventos. No se realizan cobros ni se envían correos automáticamente.

## Comprobaciones

```powershell
npm.cmd test
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
npm.cmd start
```

El desarrollo usa `.next-dev` y producción usa `.next` para que no se sobrescriban sus archivos. Las tipografías se sirven localmente; las imágenes de muestra provienen de Unsplash.

## Configuración de contenido

El nombre público de la tienda se cambia únicamente en `site.name` dentro de `lib/constants.ts`. La navegación, el pie de página, las páginas y los metadatos lo utilizan automáticamente. En el mismo objeto están los datos de contacto y las redes sociales.

- `lib/catalog.ts`: productos, fotografías, variantes y disponibilidad.
- `lib/constants.ts`: datos de negocio, WhatsApp, zonas, tarifas y horarios.
- `lib/delivery.ts`: reglas de fechas y franjas en `America/La_Paz`.
- `lib/orders.ts`: contrato de pedidos y cálculo de importes.
- `lib/server/order-store.ts`: almacenamiento de pedidos y consultas.

## Antes de publicar

Esta implementación requiere un **servidor Node con disco persistente y HTTPS**. Configura `ORDERS_DB_PATH` en un volumen persistente y `ADMIN_PASSWORD` con al menos 16 caracteres. SQLite local no sirve para el disco efímero de funciones serverless; en ese entorno se necesita un adaptador para una base alojada.

Validar fotos, productos, precios, contactos, zonas de entrega y políticas con el negocio: el catálogo original contiene datos de ejemplo. No se ha publicado ni desplegado el proyecto.

Consulta [MVP.md](MVP.md) para operación, respaldos, alcance y criterios de entrega.

## Confianza y operación · P2

Consulta [P2.md](P2.md) para la guía de compra y el seguimiento, y [OPERACION.md](OPERACION.md) para atención de pedidos, respaldo consistente, recuperación y prueba aislada. La prueba recomendada es `npm.cmd run qa:operations -- --allow-demo-orders`; no utiliza la base del negocio y no habilita ventas en la configuración principal.

## Métricas de actividad · P3

Panel privado en `/admin/metricas`, medición propia opcional y separación entre catálogo de muestra y actividad real. Consulta [P3.md](P3.md) para configuración, límites e interpretación. La medición está desactivada por defecto.
