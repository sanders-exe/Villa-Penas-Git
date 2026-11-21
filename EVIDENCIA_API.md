# Evidencia de consultas HTTP

Las siguientes consultas se ejecutaron en Swagger con **Try it out**, sin autorizar ningún esquema ni ingresar credenciales. Swagger generó comandos cURL que contienen únicamente `Accept: */*`.

Fecha de verificación: 21 de noviembre de 2026.

| Método y ruta | Estado | Muestra observada |
| --- | --- | --- |
| `GET /public/paquetes` | `200 OK` | Lista JSON de paquetes activos. El primer elemento tiene `id: 1`, nombre `Paquete Essentials`, descripción, `precioColones: 60000` y servicios incluidos. |
| `GET /public/paquetes/1` | `200 OK` | Objeto JSON del paquete `Paquete Essentials`, con su precio y servicios: Cocina equipada, Piscina, Playground, Rancho, Trampolín y Wi-Fi. |
| `GET /public/opciones-productos-adicionales` | `200 OK` | Lista JSON de opciones adicionales. Entre las primeras están Palomitas de maíz, Algodón de azúcar y Fuente de chocolate, con cantidades y precios. |

Swagger reportó `application/json; charset=utf-8` para las respuestas de listado y detalle. La API puede cambiar el contenido disponible; la interfaz vuelve a consultar los datos al iniciarse.
