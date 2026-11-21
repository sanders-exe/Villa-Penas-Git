import type { PackageItem } from '../services/api';
import { formatColones } from '../services/api';

interface PackageCardProps {
  item: PackageItem;
  selected: boolean;
  onSelect: (id: number) => void;
}

export default function PackageCard({ item, selected, onSelect }: PackageCardProps) {
  const included = item.paquetesServicios?.length ?? 0;
  return (
    <button
      className={`package-card${selected ? ' selected' : ''}`}
      onClick={() => onSelect(item.id)}
      aria-pressed={selected}
    >
      <span className="card-index">PAQUETE {String(item.id).padStart(2, '0')}</span>
      <span className="card-title">{item.nombre || `Paquete ${item.id}`}</span>
      <span className="card-description">{item.descripcion || 'Una opción para disfrutar en Villa Peñas.'}</span>
      <span className="card-bottom">
        <strong>{formatColones(item.precioColones)}</strong>
        <span>{included ? `${included} servicios` : 'Ver detalles'} <span aria-hidden="true">↗</span></span>
      </span>
    </button>
  );
}
