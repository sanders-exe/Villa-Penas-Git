import { useState } from 'react';
import AddOnCard from './components/AddOnCard';
import Estimate from './components/Estimate';
import PackageCard from './components/PackageCard';
import StateMessage from './components/StateMessage';
import usePublicResource from './hooks/usePublicResource';
import { getPublicAddOns, getPublicPackages, type AddOn, type PackageItem } from './services/api';

function searchKey(text: string) {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('es').trim();
}

function App() {
  const [packageQuery, setPackageQuery] = useState('');
  const [addOnQuery, setAddOnQuery] = useState('');
  const [priceOrder, setPriceOrder] = useState('catalog');
  const [openPackage, setOpenPackage] = useState<number | null>(null);
  const [plannedPackage, setPlannedPackage] = useState<PackageItem | null>(null);
  const [plannedAddOns, setPlannedAddOns] = useState<AddOn[]>([]);
  const [packages, reloadPackages] = usePublicResource(getPublicPackages);
  const [addOns, reloadAddOns] = usePublicResource(getPublicAddOns);

  const packageTerm = searchKey(packageQuery);
  const addOnTerm = searchKey(addOnQuery);
  const visiblePackages = packages.status === 'ready'
    ? packages.data.filter((item) => searchKey([
      item.nombre,
      item.descripcion,
      ...(item.paquetesServicios ?? []).map((link) => link.servicio?.nombre),
    ].join(' ')).includes(packageTerm))
    : [];

  if (priceOrder !== 'catalog') {
    visiblePackages.sort((first, second) => {
      const direction = priceOrder === 'ascending' ? 1 : -1;
      return (first.precioColones - second.precioColones) * direction;
    });
  }

  const visibleAddOns = addOns.status === 'ready'
    ? addOns.data.filter((item) => searchKey([
      item.nombre,
      item.descripcion,
      item.productoAdicional?.nombre,
      item.productoAdicional?.descripcion,
    ].join(' ')).includes(addOnTerm))
    : [];

  function toggleAddOn(option: AddOn) {
    setPlannedAddOns((current) => current.some((item) => item.id === option.id)
      ? current.filter((item) => item.id !== option.id)
      : [...current, option]);
  }

  return (
    <>
      <header className="site-header">
        <div className="frame header-inner">
          <a className="brand" href="#inicio">Villa Peñas</a>
          <nav aria-label="Secciones">
            <a href="#paquetes">Paquetes</a>
            <a href="#adicionales">Adicionales</a>
            <a className="nav-estimate" href="#estimado">Mi estimado <span aria-hidden="true">↗</span></a>
          </nav>
        </div>
      </header>

      <main className="frame" id="inicio">
        <div className="intro">
          <h1>Planifica tu evento</h1>
          <p>Explora qué incluye cada paquete y combina las opciones del catálogo para calcular un estimado.</p>
        </div>

        <div className="workspace">
          <div className="catalog">
            <section className="catalog-section" id="paquetes" aria-labelledby="packages-title">
              <div className="section-heading">
                <h2 id="packages-title">Paquetes</h2>
                {packages.status === 'ready' && <span className="result-count">{visiblePackages.length} de {packages.data.length}</span>}
              </div>
              <div className="filters">
                <label>
                  Buscar paquetes
                  <input type="search" placeholder="Nombre o servicio incluido" value={packageQuery} onChange={(event) => setPackageQuery(event.target.value)} />
                </label>
                <label>
                  Ordenar por
                  <select value={priceOrder} onChange={(event) => setPriceOrder(event.target.value)}>
                    <option value="catalog">Orden del catálogo</option>
                    <option value="ascending">Menor precio</option>
                    <option value="descending">Mayor precio</option>
                  </select>
                </label>
              </div>
              {packages.status === 'loading' && <StateMessage kind="loading" title="Cargando paquetes…" />}
              {packages.status === 'error' && <StateMessage kind="error" title="No se pudieron cargar los paquetes" detail={packages.message} onRetry={reloadPackages} />}
              {packages.status === 'ready' && visiblePackages.length === 0 && (
                <StateMessage kind="empty" title={packageTerm ? 'Ningún paquete coincide con tu búsqueda' : 'No hay paquetes disponibles'} />
              )}
              <div className="package-list">
                {visiblePackages.map((item) => (
                  <PackageCard
                    key={item.id}
                    item={item}
                    isOpen={openPackage === item.id}
                    isPlanned={plannedPackage?.id === item.id}
                    onToggle={() => setOpenPackage(openPackage === item.id ? null : item.id)}
                    onPlan={(detail) => setPlannedPackage((current) => current?.id === detail.id ? null : detail)}
                  />
                ))}
              </div>
            </section>

            <section className="catalog-section" id="adicionales" aria-labelledby="addons-title">
              <div className="section-heading">
                <h2 id="addons-title">Adicionales</h2>
                {addOns.status === 'ready' && <span className="result-count">{visibleAddOns.length} de {addOns.data.length}</span>}
              </div>
              <div className="filters">
                <label>
                  Buscar adicionales
                  <input type="search" placeholder="Producto o nombre de la opción" value={addOnQuery} onChange={(event) => setAddOnQuery(event.target.value)} />
                </label>
              </div>
              {addOns.status === 'loading' && <StateMessage kind="loading" title="Cargando opciones adicionales…" />}
              {addOns.status === 'error' && <StateMessage kind="error" title="No se pudieron cargar los adicionales" detail={addOns.message} onRetry={reloadAddOns} />}
              {addOns.status === 'ready' && visibleAddOns.length === 0 && (
                <StateMessage kind="empty" title={addOnTerm ? 'Ningún adicional coincide con tu búsqueda' : 'No hay adicionales disponibles'} />
              )}
              <div className="addon-grid">
                {visibleAddOns.map((option) => (
                  <AddOnCard key={option.id} option={option} selected={plannedAddOns.some((item) => item.id === option.id)} onToggle={() => toggleAddOn(option)} />
                ))}
              </div>
            </section>
          </div>

          <Estimate
            plannedPackage={plannedPackage}
            addOns={plannedAddOns}
            onRemovePackage={() => setPlannedPackage(null)}
            onRemoveAddOn={toggleAddOn}
            onClear={() => {
              setPlannedPackage(null);
              setPlannedAddOns([]);
            }}
          />
        </div>
      </main>
      <footer className="frame site-footer">
        <span>Villa Peñas · Catálogo público</span>
        <a href="#inicio">Volver arriba ↑</a>
      </footer>
    </>
  );
}

export default App;
