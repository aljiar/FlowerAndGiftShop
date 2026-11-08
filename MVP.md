# MVP Pétalo

## Alcance implementado

- Catálogo, filtros, fichas, tamaños, precios y disponibilidad desde `lib/catalog.ts`.
- Añadir desde catálogo o ficha, dedicatorias independientes, cantidades 1–99, eliminación y persistencia local. Los carritos anteriores se migran al nuevo formato.
- Un destinatario, dirección, zona, fecha y franja por pedido; dedicatoria por artículo.
- Fechas de Bolivia: lunes a sábado, hoy antes de las 14:00, franjas con dos horas de preparación y reservas hasta siete días.
- Checkout con validación y cálculo de precios y envío en el servidor. QR y transferencia se coordinan manualmente por WhatsApp.
- Pedidos guardados en SQLite antes de vaciar el carrito. Reintentos con la misma clave recuperan el pedido sin duplicarlo.
- Confirmación con resumen, estado y enlace privado; no anuncia cobros ni correos inexistentes.
- Administración protegida en `/admin/pedidos`: últimos 200 pedidos, datos de entrega, dedicatorias y cambio de estado. También muestra las últimas 100 consultas de eventos.
- Sin cuentas de clientes, favoritos, boletín, cupones, CMS ni cobros automáticos.

## Preparar y ejecutar

Requiere **Node.js 22.13 o superior**; recomendado Node.js 24. El almacenamiento usa `node:sqlite` incluido con Node. Las tipografías se sirven desde los paquetes locales: el build no necesita descargar fuentes de Google.

```powershell
npm.cmd install
npm.cmd run setup
npm.cmd run dev
```

`setup` crea `.env.local` si no existe, con una clave aleatoria de administración y la ruta de la base de datos. Si el archivo ya existe, no lo modifica. No compartas ni subas `.env.local` a Git. Puedes leer la clave en tu editor y cambiarla por otra de al menos 16 caracteres.

Abre `/admin/pedidos` e ingresa el valor de `ADMIN_PASSWORD`. La sesión dura ocho horas; cambiar la clave invalida las sesiones existentes. En producción se requiere HTTPS para la cookie segura. Hay un límite de 20 intentos por minuto por proceso.

```powershell
npm.cmd test
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
npm.cmd start
```

## Operación de pedidos

1. El cliente confirma: se guarda como **Pendiente de pago**.
2. El cliente abre WhatsApp desde la confirmación y solicita el QR o datos bancarios. El sitio no envía mensajes automáticamente.
3. El negocio verifica el pago y la disponibilidad de entrega, y marca **Pago confirmado**.
4. Actualiza a **En preparación** y luego **Entregado**, o **Cancelado** cuando corresponda.

El enlace de confirmación contiene un token privado que permite consultar el pedido. No publicarlo ni compartirlo con terceros. No hay email automático ni consulta pública de pedidos por número.

## Despliegue y datos

Esta versión requiere **un servidor Node con disco persistente**, una sola instancia de aplicación y HTTPS. `ORDERS_DB_PATH` debe apuntar al volumen persistente. En producción, si falta esa variable, el checkout falla sin confirmar ni vaciar el carrito. No desplegar esta base SQLite en el disco efímero de Vercel o de una función serverless: para esas plataformas se debe sustituir el adaptador por una base de datos alojada.

Los pedidos y consultas contienen datos personales. Restringir el acceso al servidor y al volumen, definir una política de conservación y respaldar la base con la herramienta de backup de SQLite o una instantánea consistente del volumen. No copiar solamente `orders.sqlite` mientras la aplicación escribe: WAL puede contener transacciones recientes. Probar la restauración antes de operar con clientes.

El catálogo expresa disponibilidad manual mediante `inStock`; no descuenta inventario ni reserva unidades automáticamente. Antes del lanzamiento deben validarse **fotografías, precios, productos, teléfonos, WhatsApp, dirección, zonas, tarifas y políticas reales**. Los datos actuales provienen del catálogo de ejemplo original.

## Verificación manual de lanzamiento

- Móvil y escritorio: fotos, filtros, tamaños, dedicatorias y precios.
- Añadir dos arreglos iguales con dedicatorias distintas; recargar; modificar cantidades y eliminar.
- Completar comprador y destinatario, elegir fecha/franja válidas y comprobar envío gratis.
- Ante un error de red, conservar carrito y reintentar sin duplicar pedidos.
- Comprobar pedido en administración, cambiar estado y verificar la confirmación.
- Confirmar que una URL sin token o con token incorrecto no muestra datos.
- Reiniciar el servidor y comprobar que los pedidos siguen disponibles.

## Pruebas HTTP reproducibles

`scripts/mvp-http.mjs` prueba las rutas de producción: precio recalculado, reintentos concurrentes, confirmación privada y administración. Crea pedidos ficticios: ejecutarlo contra un servidor de QA con una base separada, usando las variables `MVP_TEST_BASE_URL` y `MVP_TEST_ADMIN_PASSWORD`. No ejecutarlo contra la tienda en operación.
