import { formatColones, imageUrl, type AddOn } from '../services/api';

interface AddOnCardProps {
  option: AddOn;
  selected: boolean;
  onToggle: () => void;
}

export default function AddOnCard({ option, selected, onToggle }: AddOnCardProps) {
  const product = option.productoAdicional;
  const photo = imageUrl(product?.imagenUrl);
  const portion = [option.cantidadIncluida, option.unidadMedida].filter((part) => part != null && part !== '').join(' ');

  return (
    <article className="addon-card">
      {photo && <img className="addon-photo" src={photo} alt="" loading="lazy" onError={(event) => { event.currentTarget.hidden = true; }} />}
      <div className="addon-content">
        {product?.nombre && <p className="product-name">{product.nombre}</p>}
        <h3>{option.nombre}</h3>
        {(option.descripcion || product?.descripcion) && <p>{option.descripcion || product?.descripcion}</p>}
        {(portion || option.cantidadPersonas != null) && (
          <p className="addon-quantity">
            {portion && <>Incluye {portion}</>}
            {portion && option.cantidadPersonas != null && ' · '}
            {option.cantidadPersonas != null && (option.cantidadPersonas === 1 ? '1 persona' : option.cantidadPersonas + ' personas')}
          </p>
        )}
        <div className="addon-actions">
          <strong>{formatColones(option.precioVentaColones)}</strong>
          <button type="button" className="button button-outline" aria-label={(selected ? 'Quitar ' : 'Agregar ') + [product?.nombre, option.nombre].filter(Boolean).join(' · ')} onClick={onToggle}>
            {selected ? 'Quitar' : 'Agregar'}
          </button>
        </div>
      </div>
    </article>
  );
}
