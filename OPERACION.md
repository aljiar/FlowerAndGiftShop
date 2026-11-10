# Operación de pedidos · Norah’s Garden

Esta guía describe el motor preparado. La tienda sigue en modo de muestra hasta completar P0.md. No se habilitan ventas ni se promete disponibilidad con esta entrega.

## Recibir y preparar un pedido

1. Revisa `/admin/pedidos`: comprador, destinatario, teléfono, dirección, fecha/franja, referencias, dedicatoria, cantidades y total. Comprueba las consultas de eventos por separado.
2. Antes del pago, confirma por WhatsApp composición, disponibilidad, entrega, importe y las condiciones aplicables. Las políticas de sustitución, cambios y cancelaciones siguen pendientes de definir.
3. El pedido comienza como **Pendiente de pago**. Proporciona QR o cuenta de transferencia y verifica el pago manualmente. La web no cobra ni valida comprobantes.
4. Elige **Pago confirmado** y pulsa **Guardar estado** solo después de verificarlo y confirmar la entrega. El cliente puede actualizar su enlace privado para consultarlo.
5. Actualiza a **En preparación** y luego **Entregado** cuando corresponda. Para una cancelación, coordina las condiciones con el comprador y guarda **Cancelado**. Ese estado no ejecuta un reembolso.
6. Si hay un error al guardar, la interfaz lo indica. Reintenta y comprueba que el estado mostrado quedó actualizado. No se envían mensajes ni correos automáticos.

Los enlaces de confirmación permiten consultar datos del pedido: no publicarlos ni copiarlos en reportes. No hay consulta pública por número. La disponibilidad de catálogo es manual, sin reserva automática de inventario o cupos.

## Respaldo consistente

Se requiere Node 22.13 o superior y la ruta explícita de la base. El comando no toma una base de producción por defecto ni sobrescribe un destino existente.

```powershell
npm.cmd run orders:backup -- --source "RUTA/base/orders.sqlite" --destination "RUTA/respaldos/orders-fecha.sqlite"
```

Utiliza [VACUUM INTO de SQLite](https://www.sqlite.org/lang_vacuum.html#vacuum_with_an_into_clause) para generar una copia consistente, incluyendo los datos confirmados que estén en WAL. Comprueba integridad y tablas antes y después. No basta con copiar únicamente el archivo principal mientras hay escrituras. El resultado del comando informa ubicación y cantidades, sin imprimir datos personales.

Define una frecuencia de respaldo de acuerdo con el volumen de pedidos y cuántos podrías reconstruir si se pierde el servidor. Guarda una copia en una ubicación protegida distinta del disco principal. No se configura una tarea automática ni se suben respaldos a ningún servicio en esta entrega.

## Restaurar sin sobrescribir datos

```powershell
npm.cmd run orders:restore -- --source "RUTA/respaldos/orders-fecha.sqlite" --destination "RUTA/recuperacion/orders-restaurados.sqlite"
```

Primero restaura a un archivo nuevo. Con una instancia de prueba y `ORDERS_DB_PATH` apuntando a esa copia, revisa pedidos, estados, consultas y un enlace privado autorizado. El programa rechaza un destino existente. Para cambiar la tienda operativa a una base restaurada, detén la recepción de pedidos, conserva la base actual y sus datos, y realiza el cambio en una ventana acordada. No sustituye ni elimina automáticamente la base activa.

## Prueba aislada de operación

```powershell
npm.cmd run qa:operations -- --allow-demo-orders
```

El comando construye una versión de QA en `.next-qa`, utiliza una base temporal nueva, genera una clave de administración efímera y abre solo un puerto local. No lee la base real ni los secretos del negocio; no imprime claves o tokens. Registra pedidos y consultas ficticias, comprueba reintentos, estados, autorización, persistencia después de reiniciar y recuperación de una copia. No abre WhatsApp ni procesa pagos.

La configuración principal conserva los pedidos bloqueados. Al terminar, el runner cierra el servidor. Los archivos temporales de QA se identifican como ficticios y pueden conservarse para diagnóstico; no son respaldos del negocio.

Los identificadores y precios esperados de esta prueba corresponden al catálogo de ejemplo. Actualiza sus casos al aprobar un catálogo diferente.

## Pendientes comerciales

Catálogo y fotos reales, precios, cobertura, tarifas, horarios/cupos de entrega, cambios, cancelaciones, sustituciones y conservación de datos siguen por aprobar. También falta dominio y alojamiento. La guía pública comunica lo confirmado y remite a consulta para lo pendiente.
