const API_BASE_URL = import.meta.env.DEV ? '' : 'https://villa-penas-production.up.railway.app';

export interface Service {
  id: number;
  nombre: string;
  descripcion?: string | null;
  unidadMedida?: string | null;
}

export interface PackageService {
  id: number;
  detalle?: string | null;
  cantidad?: number | null;
  servicio?: Service;
}

export interface PackageItem {
  id: number;
  nombre: string;
  descripcion?: string | null;
  precioColones: number;
  activo: boolean;
  paquetesServicios?: PackageService[];
}

export interface AddOn {
  id: number;
  nombre: string;
  descripcion?: string | null;
  unidadMedida?: string | null;
  cantidadIncluida?: number | null;
  cantidadPersonas?: number | null;
  precioVentaColones: number;
  productoAdicional?: {
    nombre?: string;
    descripcion?: string | null;
    imagenUrl?: string | null;
  };
}

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`La API respondió ${response.status}${detail ? `: ${detail}` : ''}`);
  }

  return response.json() as Promise<T>;
}

export const getPublicPackages = (signal?: AbortSignal) =>
  getJson<PackageItem[]>('/public/paquetes', signal);

export const getPublicPackage = (id: number, signal?: AbortSignal) =>
  getJson<PackageItem>(`/public/paquetes/${id}`, signal);

export const getPublicAddOns = (signal?: AbortSignal) =>
  getJson<AddOn[]>('/public/opciones-productos-adicionales', signal);

export function imageUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (import.meta.env.DEV && path.startsWith('/')) return path;
  try {
    return new URL(path, `${API_BASE_URL}/`).toString();
  } catch {
    return undefined;
  }
}

export function formatColones(amount?: number): string {
  if (typeof amount !== 'number') return 'Precio no disponible';
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    maximumFractionDigits: 0,
  }).format(amount);
}
