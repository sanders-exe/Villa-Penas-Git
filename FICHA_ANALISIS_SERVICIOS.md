# Ficha de análisis de servicios públicos

**Aplicación:** Villa Peñas | Planificador de eventos

**Documentación:** [Swagger de Villa Peñas](https://villa-penas-production.up.railway.app/api/docs)

Las tres rutas figuran en los grupos públicos de Swagger. El 21 de noviembre de 2026 las tres respondieron con HTTP 200 y JSON mediante GET sin cookies ni encabezado de autorización.

| Recurso / operación GET | Datos relevantes | Uso en la interfaz | Justificación |
| --- | --- | --- | --- |
| `/public/paquetes` | `id`, `nombre`, `descripcion`, `precioColones`, `paquetesServicios[].servicio.nombre`. | Construye la lista, la búsqueda por texto y servicio, y el orden por precio. El identificador sirve para abrir el paquete. | Es el punto de partida para comparar las opciones base del evento. |
| `/public/paquetes/{id}` | `id`, `nombre`, `descripcion`, `precioColones`, `paquetesServicios[].detalle`, `cantidad` y datos del servicio asociado. | Carga la descripción y los servicios del paquete abierto. Si se selecciona para el estimado, se usa el precio del detalle. | Permite revisar qué incluye cada opción y consultar el recurso específico mediante su identificador de ruta. |
| `/public/opciones-productos-adicionales` | `id`, `nombre`, `descripcion`, `unidadMedida`, `cantidadIncluida`, `cantidadPersonas`, `precioVentaColones` y `productoAdicional` con nombre, descripción e imagen. | Presenta variantes buscables y permite agregar o quitar opciones que contribuyen al estimado. | Ofrece complementos con precio propio para calcular distintas combinaciones. |

El nombre de una variante y sus campos de cantidad provienen del catálogo y pueden diferir. El estimado suma el precio publicado por cada opción elegida.
