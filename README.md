# Explorador público de Villa Peñas

Aplicación académica para consumir tres operaciones `GET` públicas de la API Villa Peñas con React, TypeScript y Vite.

## Servicios consultados

| Operación | Datos relevantes | Uso en la interfaz |
| --- | --- | --- |
| `GET /public/paquetes` | Identificador, nombre, descripción, precio y servicios incluidos del catálogo activo. | Lista de paquetes y búsqueda por nombre, descripción o servicio. |
| `GET /public/paquetes/{id}` | Detalle del paquete activo y los servicios incluidos. | Vista detallada al seleccionar un paquete. |
| `GET /public/opciones-productos-adicionales` | Nombre del producto y opción, descripción, cantidades, unidad, precio e imagen. | Catálogo de servicios adicionales y búsqueda. |

Las tres operaciones están agrupadas en Swagger como públicas. Se verificaron con `Try it out` sin credenciales y respondieron `200 OK` el 21 de noviembre de 2026. Las respuestas observadas usan JSON.

## Requisitos

- Node.js 20.19+ o 22.12+.
- Conexión a internet para instalar dependencias y consultar la API.

## Iniciar el proyecto

En una terminal, desde esta carpeta:

```bash
npm install
npm run dev
```

Abre la dirección local que muestre Vite. Para preparar una versión de producción:

```bash
npm run build
npm run preview
```

## Probar y presentar

1. Abre la aplicación y espera a que carguen los paquetes y adicionales.
2. Escribe en los campos de búsqueda para filtrar los resultados.
3. Selecciona un paquete para consultar su detalle desde el endpoint con `{id}`.
4. Abre las herramientas del navegador y selecciona **Network / Red**. Filtra por `Fetch/XHR` y muestra las solicitudes `GET` a `/public/paquetes`, `/public/paquetes/{id}` y `/public/opciones-productos-adicionales`, junto con sus respuestas.
5. Si un servicio falla, la interfaz muestra un error y permite reintentar. Las consultas vacías y el estado de carga también tienen mensajes propios.

Los precios, nombres, descripciones e imágenes se obtienen de respuestas reales; la aplicación no sustituye los datos de la API por listas estáticas. El endpoint público devuelve solo elementos activos y el catálogo puede cambiar con el tiempo. Vite reenvía las solicitudes de desarrollo a la API para evitar depender de CORS en el navegador local. Al publicar una compilación en otro dominio, el servidor debe permitir ese origen mediante CORS o un proxy equivalente.

## Organización

- `src/services/api.ts`: tipos y funciones HTTP para las tres consultas.
- `src/components/PackageCard.tsx`: tarjeta reutilizable de paquete.
- `src/components/StateMessage.tsx`: estados de carga, error y resultado vacío.
- `src/App.tsx`: pantalla, búsquedas, selección y detalle.

## Documentación complementaria

- `FICHA_ANALISIS_SERVICIOS.md`: análisis y justificación de los tres endpoints seleccionados.
- `GUIA_EXPLICACION.md`: resumen para explicar la aplicación y su demostración.
- `EVIDENCIA_API.md`: registro de las consultas públicas verificadas.
