# Evidencia de ejecución

Comprobación en Chrome el 21 de noviembre de 2026 con Vite en `http://127.0.0.1:5173`. El proxy reenvió las rutas a `https://villa-penas-production.up.railway.app`.

| Consulta observada | Resultado | Contenido de ejemplo |
| --- | --- | --- |
| `GET /public/paquetes` | 200 | Dos paquetes públicos con identificadores y precios. |
| `GET /public/paquetes/1` | 200 | Paquete Essentials y sus seis servicios incluidos. |
| `GET /public/opciones-productos-adicionales` | 200 | Diez opciones adicionales con nombre de producto, precio y atributos de cantidad. |

En `../Evidencia/` están las capturas del planificador, las de Network y `consultas-api.har`, que contiene las tres solicitudes con sus cuerpos JSON. Para revisarlo en Chrome, abre **Network → Import HAR** y selecciona ese archivo.
