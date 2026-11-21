# Villa Peñas | Planificador de eventos

Aplicación en React, TypeScript y Vite para explorar el catálogo público de Villa Peñas y estimar el costo de un evento con un paquete y varios adicionales.

## Ejecutar

Requisitos: Node.js 20.19+ o 22.12+, npm y conexión a internet.

Desde `Proyecto/`:

```sh
npm ci
npm run dev
```

Abre la dirección que indica Vite. Para verificar tipos y generar la compilación, ejecuta `npm run build`.

## Demostración

1. Filtra los paquetes por nombre o servicio y ordénalos por precio.
2. Abre un paquete para cargar sus servicios. Usa **Usar este paquete** para incorporarlo al estimado.
3. Busca un adicional y pulsa **Agregar**. El panel **Mi estimado** suma los precios en colones. Puedes quitar elementos, cambiar de paquete o vaciar la selección.
4. Para repetir la comprobación de HTTP, abre **Network/Red → Fetch/XHR**, recarga la página y abre un paquete. Revisa **Headers** y **Response** de las tres solicitudes.

## Organización

- `src/services/api.ts` contiene los tipos y las tres consultas GET.
- `src/hooks/usePublicResource.ts` coordina carga, error, reintento y cancelación.
- `src/components/` contiene las tarjetas de paquetes y adicionales, el panel de estimado y los mensajes de estado.
- `src/App.tsx` integra el catálogo, los filtros, el orden y la selección.
- `FICHA_ANALISIS_SERVICIOS.md` documenta los campos, su uso y la elección de las tres rutas.
- `GUIA_EXPLICACION.md` describe las decisiones técnicas y las pruebas.
- `EVIDENCIA_API.md` identifica los archivos de evidencia.

## Alcance

El estimado es informativo y se conserva durante la sesión de la página. El proxy local de Vite reenvía las consultas GET y las imágenes al servidor de Villa Peñas. En un despliegue web separado, las peticiones dependen de la política CORS del servidor o de un proxy equivalente.
