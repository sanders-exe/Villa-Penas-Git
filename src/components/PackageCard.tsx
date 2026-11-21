import { useCallback } from 'react';
import usePublicResource from '../hooks/usePublicResource';
import { formatColones, getPublicPackage, type PackageItem } from '../services/api';
import StateMessage from './StateMessage';

interface PackageDetailsProps {
  id: number;
  isPlanned: boolean;
  onPlan: (detail: PackageItem) => void;
}

function PackageDetails({ id, isPlanned, onPlan }: PackageDetailsProps) {
  const load = useCallback((signal: AbortSignal) => getPublicPackage(id, signal), [id]);
  const [detail, reload] = usePublicResource(load);

  if (detail.status === 'loading') return <StateMessage kind="loading" title="Cargando detalle del paquete…" />;
  if (detail.status === 'error') return <StateMessage kind="error" title="No se pudo cargar el detalle" detail={detail.message} onRetry={reload} />;

  const { data } = detail;
  const included = data.paquetesServicios ?? [];

  return (
    <>
      {data.descripcion && <p>{data.descripcion}</p>}
      <h4>Servicios incluidos</h4>
      {included.length > 0 ? (
        <ul className="included-services">
          {included.map((link) => (
            <li key={link.id}>
              <strong>{link.servicio?.nombre ?? 'Servicio del paquete'}</strong>
              {link.cantidad != null && <span> · {link.cantidad} {link.servicio?.unidadMedida}</span>}
              {link.detalle && <span className="service-description">{link.detalle}</span>}
              {link.servicio?.descripcion && <span className="service-description">{link.servicio.descripcion}</span>}
            </li>
          ))}
        </ul>
      ) : <p>El catálogo no enumera servicios para este paquete.</p>}
      <button type="button" className="button button-primary" onClick={() => onPlan(data)}>
        {isPlanned ? 'Quitar del estimado' : 'Usar este paquete'}
      </button>
    </>
  );
}

interface PackageCardProps {
  item: PackageItem;
  isOpen: boolean;
  isPlanned: boolean;
  onToggle: () => void;
  onPlan: (detail: PackageItem) => void;
}

export default function PackageCard({ item, isOpen, isPlanned, onToggle, onPlan }: PackageCardProps) {
  const detailId = 'detalle-paquete-' + item.id;
  const triggerId = 'paquete-' + item.id;
  return (
    <article className="package-card">
      <h3>
        <button type="button" id={triggerId} className="package-trigger" aria-expanded={isOpen} aria-controls={detailId} onClick={onToggle}>
          <span className="package-title">
            {item.nombre}
            {isPlanned && <small>En tu estimado</small>}
          </span>
          <span className="package-price">{formatColones(item.precioColones)}</span>
          <span className="expand-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
        </button>
      </h3>
      <div className="package-detail" id={detailId} role="region" aria-labelledby={triggerId} hidden={!isOpen}>
        {isOpen && <PackageDetails id={item.id} isPlanned={isPlanned} onPlan={onPlan} />}
      </div>
    </article>
  );
}
