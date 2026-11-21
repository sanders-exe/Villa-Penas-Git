# Ficha de análisis de servicios públicos

**Aplicación:** Explorador público de Villa Peñas  
**Documentación consultada:** [Swagger de Villa Peñas](https://villa-penas-production.up.railway.app/api/docs)

Se seleccionaron estas tres operaciones porque la documentación las clasifica como públicas, son consultas `GET` y responden sin credenciales. En la interfaz se usan para consultar datos reales del catálogo y su detalle.

| Recurso / operación GET | Datos relevantes | Uso dentro de la interfaz | Justificación de elección |
| --- | --- | --- | --- |
| `/public/paquetes` | Identificador, nombre, descripción, precio y servicios incluidos. | Mostrar y filtrar los paquetes públicos. | Es el recurso principal para que la persona compare opciones disponibles. Proporciona los campos necesarios para distinguir cada paquete y encontrarlo por texto o servicios. |
| `/public/paquetes/{id}` | Identificador y datos del paquete seleccionado, precio y servicios incluidos con sus descripciones. | Cargar el detalle al seleccionar una tarjeta del catálogo. | Complementa el listado con información específica del paquete elegido y demuestra una consulta GET con parámetro de ruta. |
| `/public/opciones-productos-adicionales` | Nombre del producto y de la opción, descripción, cantidades, unidad, precio e imagen cuando está disponible. | Mostrar y filtrar servicios adicionales. | Amplía la exploración más allá de los paquetes y permite comparar productos complementarios con sus cantidades y precios. |

## Verificación y límites

Las tres rutas se probaron sin enviar credenciales y devolvieron `200 OK` con contenido JSON. La evidencia de Network/Red está en la carpeta `Evidencia/` del paquete de entrega. En desarrollo, Vite reenvía las solicitudes desde `localhost:5173` hacia la API pública; por eso Network muestra el origen local y los encabezados de respuesta del servidor Railway.

La aplicación solo presenta los recursos activos que devuelve la API en el momento de la consulta. Sus nombres, precios, imágenes y disponibilidad pueden cambiar.
