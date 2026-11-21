# Guía breve para explicar el proyecto

## Qué hace

La aplicación consulta la API REST pública de Villa Peñas y permite explorar paquetes para eventos y productos adicionales. Todos los datos que aparecen en los listados provienen de respuestas HTTP reales.

## Los tres servicios

1. **`GET /public/paquetes`** devuelve los paquetes activos, con campos como `id`, `nombre`, `descripcion`, `precioColones` y `paquetesServicios`. Se usa para mostrar el catálogo y buscar por nombre, descripción o servicio incluido.
2. **`GET /public/paquetes/{id}`** devuelve un paquete activo específico y los servicios que incluye. Se llama cuando la persona selecciona una tarjeta y se presenta en el panel de detalle.
3. **`GET /public/opciones-productos-adicionales`** devuelve opciones activas con el producto, descripción, unidad, cantidades, precio e imagen. Se presenta en el catálogo de adicionales y se puede filtrar por texto.

Las tres operaciones se probaron desde Swagger sin ingresar credenciales. El 21 de noviembre de 2026 respondieron `200 OK`; sus comandos cURL solo enviaron el encabezado `Accept`, sin `Authorization`.

## Cómo está organizado

- `src/services/api.ts` concentra las rutas, los tipos TypeScript y las solicitudes `fetch`.
- `src/components/PackageCard.tsx` dibuja una tarjeta de paquete reutilizable.
- `src/components/StateMessage.tsx` muestra estados de carga, error y lista vacía.
- `src/App.tsx` coordina las consultas, la búsqueda, la selección y la vista de detalle.

## Cómo explicar los estados

- **Cargando:** se muestra mientras la API procesa la solicitud.
- **Error:** se presenta el código o mensaje recibido y se ofrece reintentar.
- **Sin resultados:** se muestra cuando la API devuelve una lista vacía o cuando el filtro no encuentra coincidencias.
- **Listo:** se muestran tarjetas, precios, descripciones y servicios de la respuesta.

## Demostración en Network / Red

1. Recarga la aplicación con las herramientas del navegador abiertas.
2. En **Network / Red**, filtra por `Fetch/XHR`.
3. Selecciona cada solicitud `GET` y muestra su URL, estado `200` y respuesta JSON.
4. Haz clic en otro paquete: debe aparecer la consulta de detalle con su identificador.
5. Escribe en las búsquedas para demostrar el filtro sin sustituir los datos de la API.

## Limitaciones

La interfaz muestra únicamente recursos públicos activos que la API devuelve en el momento de la consulta. Los datos pueden cambiar. Las consultas desde el navegador dependen de la disponibilidad del servidor y de su política CORS.
