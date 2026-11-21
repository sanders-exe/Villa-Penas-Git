import { formatColones, type AddOn, type PackageItem } from '../services/api';

interface EstimateProps {
  plannedPackage: PackageItem | null;
  addOns: AddOn[];
  onRemovePackage: () => void;
  onRemoveAddOn: (item: AddOn) => void;
  onClear: () => void;
}

export default function Estimate({ plannedPackage, addOns, onRemovePackage, onRemoveAddOn, onClear }: EstimateProps) {
  const prices = addOns.map((item) => item.precioVentaColones);
  if (plannedPackage) prices.push(plannedPackage.precioColones);
  const hasItems = prices.length > 0;
  const total = prices.every(Number.isFinite) ? prices.reduce((sum, price) => sum + price, 0) : undefined;

  return (
    <aside id="estimado" className="estimate" aria-labelledby="estimate-title">
      <div className="estimate-heading">
        <h2 id="estimate-title">Mi estimado</h2>
        {hasItems && <button type="button" className="text-button" onClick={onClear}>Limpiar</button>}
      </div>
      {hasItems ? (
        <ul className="estimate-items">
          {plannedPackage && (
            <li>
              <div><strong>{plannedPackage.nombre}</strong><span>{formatColones(plannedPackage.precioColones)}</span></div>
              <button type="button" className="remove-button" aria-label={'Quitar ' + plannedPackage.nombre + ' del estimado'} onClick={onRemovePackage}>×</button>
            </li>
          )}
          {addOns.map((item) => (
            <li key={item.id}>
              <div>
                <strong>{[item.productoAdicional?.nombre, item.nombre].filter(Boolean).join(' · ')}</strong>
                <span>{formatColones(item.precioVentaColones)}</span>
              </div>
              <button type="button" className="remove-button" aria-label={'Quitar ' + [item.productoAdicional?.nombre, item.nombre].filter(Boolean).join(' · ') + ' del estimado'} onClick={() => onRemoveAddOn(item)}>×</button>
            </li>
          ))}
        </ul>
      ) : <p>Abre un paquete para elegirlo. También puedes sumar opciones adicionales.</p>}
      <div className="estimate-total" aria-live="polite" aria-atomic="true">
        <span>Total estimado</span>
        <strong>{formatColones(total)}</strong>
      </div>
      <p className="estimate-note">Monto orientativo calculado con los precios del catálogo.</p>
    </aside>
  );
}
