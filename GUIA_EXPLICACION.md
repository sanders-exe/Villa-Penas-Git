# Guía para explicar y demostrar el planificador

## Flujo de datos

Al iniciar, la página solicita los listados de paquetes y adicionales. Al abrir una fila del catálogo llama a `GET /public/paquetes/{id}`. El componente de detalle se desmonta al cerrar la fila y cancela la consulta pendiente. El cliente HTTP centraliza el origen, el manejo de errores y la lectura de JSON.

Los filtros se aplican sobre las respuestas en memoria, sin distinguir mayúsculas ni tildes. El orden por precio opera sobre la lista filtrada. El estimado tiene un solo paquete base y hasta una selección de cada opción adicional. Cambiar el paquete conserva los adicionales elegidos. La selección y su suma se mantienen en el estado de React hasta que se recarga la página.

## Comprobación

- La compilación de TypeScript y Vite terminó correctamente con `npm run build`.
- En Chrome se observaron tres GET con HTTP 200 y JSON real. Se abrió el detalle de un paquete, se seleccionó como base y se confirmó que el precio total coincidía con la suma de la base y el adicional. También se verificaron el cambio de paquete, el orden por precio, la búsqueda y la eliminación de opciones.
- En una prueba aparte se controlaron las respuestas del navegador para comprobar demora, error HTTP 503, reintento y lista vacía. Las capturas de la interfaz y el archivo HAR corresponden a la ejecución con la API real.
- Se verificó el diseño a 390 px de ancho en un navegador móvil emulado.

## Limitaciones observadas

La disponibilidad y los precios dependen de la API pública. El monto es orientativo y usa un precio por opción seleccionada. Si el nombre de una opción menciona una cantidad que difiere de los campos numéricos, la interfaz muestra ambos tal como los publica la API. Al consultar desde un sitio publicado en un origen distinto, interviene la configuración CORS del servidor.
