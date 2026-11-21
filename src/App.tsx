import { useEffect, useMemo, useState } from 'react';
import PackageCard from './components/PackageCard';
import StateMessage from './components/StateMessage';
import {
  formatColones,
  getPublicAddOns,
  getPublicPackage,
  getPublicPackages,
  imageUrl,
  type AddOn,
  type PackageItem,
} from './services/api';

type LoadState<T> = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready'; data: T };

const money = (amount?: number) => formatColones(amount);

function App() {
  const [packagesState, setPackagesState] = useState<LoadState<PackageItem[]>>({ status: 'loading' });
  const [addOnsState, setAddOnsState] = useState<LoadState<AddOn[]>>({ status: 'loading' });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detailState, setDetailState] = useState<LoadState<PackageItem> | null>(null);
  const [detailReload, setDetailReload] = useState(0);
  const [packageSearch, setPackageSearch] = useState('');
  const [addOnSearch, setAddOnSearch] = useState('');

  const loadPackages = async () => {
    setPackagesState({ status: 'loading' });
    try {
      const data = await getPublicPackages();
      setPackagesState({ status: 'ready', data: Array.isArray(data) ? data : [] });
      if (data.length && selectedId === null) setSelectedId(data[0].id);
    } catch (error) {
      setPackagesState({ status: 'error', message: error instanceof Error ? error.message : 'No se pudieron cargar los paquetes.' });
    }
  };

  const loadAddOns = async () => {
    setAddOnsState({ status: 'loading' });
    try {
      const data = await getPublicAddOns();
      setAddOnsState({ status: 'ready', data: Array.isArray(data) ? data : [] });
    } catch (error) {
      setAddOnsState({ status: 'error', message: error instanceof Error ? error.message : 'No se pudieron cargar los productos adicionales.' });
    }
  };

  useEffect(() => {
    void loadPackages();
    void loadAddOns();
  }, []);

  useEffect(() => {
    if (selectedId === null) {
      setDetailState(null);
      return;
    }
    const controller = new AbortController();
    setDetailState({ status: 'loading' });
    getPublicPackage(selectedId, controller.signal)
      .then((data) => setDetailState({ status: 'ready', data }))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setDetailState({ status: 'error', message: error instanceof Error ? error.message : 'No se pudo cargar el detalle del paquete.' });
        }
      });
    return () => controller.abort();
  }, [selectedId, detailReload]);

  const filteredPackages = useMemo(() => {
    if (packagesState.status !== 'ready') return [];
    const term = packageSearch.trim().toLocaleLowerCase('es');
    return packagesState.data.filter((item) => {
      const services = item.paquetesServicios?.map((link) => link.servicio?.nombre ?? '').join(' ') ?? '';
      return `${item.nombre} ${item.descripcion ?? ''} ${services}`.toLocaleLowerCase('es').includes(term);
    });
  }, [packagesState, packageSearch]);

  const filteredAddOns = useMemo(() => {
    if (addOnsState.status !== 'ready') return [];
    const term = addOnSearch.trim().toLocaleLowerCase('es');
    return addOnsState.data.filter((item) => {
      const productName = item.productoAdicional?.nombre ?? '';
      return `${productName} ${item.nombre} ${item.descripcion ?? ''}`.toLocaleLowerCase('es').includes(term);
    });
  }, [addOnsState, addOnSearch]);

  const selectedListItem = packagesState.status === 'ready'
    ? packagesState.data.find((item) => item.id === selectedId)
    : undefined;

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Villa Peñas, inicio">
          <span className="brand-icon" aria-hidden="true">VP</span>
          <span>VILLA PEÑAS<span className="brand-sub">EXPERIENCIAS PARA COMPARTIR</span></span>
        </a>
        <nav aria-label="Navegación principal">
          <a href="#paquetes">Paquetes</a>
          <a href="#adicionales">Adicionales</a>
        </nav>
        <a className="top-cta" href="#paquetes">Explorar <span aria-hidden="true">↗</span></a>
      </header>

      <main id="inicio">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow"><span className="live-dot" /> NICoya · GUANACASTE</span>
            <h1>Momentos que<br /><em>se quedan.</em></h1>
            <p>Encuentra el espacio y los detalles para celebrar a tu manera. Explora nuestros paquetes y servicios disponibles.</p>
            <a href="#paquetes" className="hero-button">Ver paquetes <span aria-hidden="true">↓</span></a>
          </div>
          <div className="hero-art" aria-label="Ilustración de montañas tropicales y una piscina">
            <div className="sun" />
            <div className="hill hill-back" />
            <div className="hill hill-mid" />
            <div className="hill hill-front" />
            <div className="pool"><span /></div>
            <span className="art-label">UN LUGAR PARA CELEBRAR</span>
          </div>
          <div className="hero-foot"><span>01 / DESCUBRE</span><span>DISEÑA TU DÍA IDEAL</span></div>
        </section>

        <section className="content-section package-section" id="paquetes">
          <div className="section-heading">
            <div>
              <span className="eyebrow">01 — ENCUENTRA TU ESPACIO</span>
              <h2>Paquetes <em>públicos</em></h2>
              <p>Opciones disponibles para hacer de tu evento algo especial.</p>
            </div>
            <label className="search-box">
              <span aria-hidden="true">⌕</span>
              <input value={packageSearch} onChange={(event) => setPackageSearch(event.target.value)} placeholder="Buscar paquetes o servicios" aria-label="Buscar paquetes o servicios" />
              <kbd>FILTRAR</kbd>
            </label>
          </div>

          <div className="package-layout">
            <div className="package-list" aria-live="polite">
              {packagesState.status === 'loading' && <StateMessage kind="loading" title="Cargando paquetes" detail="Consultando el catálogo público de Villa Peñas…" />}
              {packagesState.status === 'error' && <StateMessage kind="error" title="No pudimos cargar los paquetes" detail={packagesState.message} onRetry={() => void loadPackages()} />}
              {packagesState.status === 'ready' && filteredPackages.length === 0 && <StateMessage kind="empty" title={packageSearch ? 'No hay coincidencias' : 'No hay paquetes disponibles'} detail={packageSearch ? 'Prueba con otra palabra.' : 'La API no devolvió paquetes públicos en este momento.'} />}
              {packagesState.status === 'ready' && filteredPackages.map((item) => (
                <PackageCard key={item.id} item={item} selected={item.id === selectedId} onSelect={setSelectedId} />
              ))}
            </div>

            <aside className="detail-panel" aria-live="polite">
              <div className="panel-topline"><span>VILLA PEÑAS · NICoya</span><span>↗</span></div>
              {!selectedListItem && packagesState.status === 'ready' && <StateMessage kind="empty" title="Elige un paquete" detail="Selecciona una opción para ver sus servicios incluidos." />}
              {detailState?.status === 'loading' && <StateMessage kind="loading" title="Cargando detalle" detail="Consultando el paquete seleccionado…" />}
              {detailState?.status === 'error' && <StateMessage kind="error" title="No pudimos cargar el detalle" detail={detailState.message} onRetry={() => setDetailReload((value) => value + 1)} />}
              {detailState?.status === 'ready' && (
                <>
                  <span className="detail-kicker">PAQUETE {String(detailState.data.id).padStart(2, '0')}</span>
                  <h3>{detailState.data.nombre}</h3>
                  <p className="detail-description">{detailState.data.descripcion || 'Conoce los servicios incluidos en esta opción.'}</p>
                  <div className="detail-price"><span>DESDE</span><strong>{money(detailState.data.precioColones)}</strong></div>
                  <div className="service-list-title"><span>LO QUE INCLUYE</span><span>{detailState.data.paquetesServicios?.length ?? 0} SERVICIOS</span></div>
                  <ul className="service-list">
                    {(detailState.data.paquetesServicios ?? []).map((link) => (
                      <li key={link.id}>
                        <span className="checkmark" aria-hidden="true">✓</span>
                        <span><strong>{link.servicio?.nombre ?? link.detalle ?? 'Servicio incluido'}</strong>{link.servicio?.descripcion && <small>{link.servicio.descripcion}</small>}</span>
                      </li>
                    ))}
                    {!detailState.data.paquetesServicios?.length && <li className="muted">Consulta la descripción del paquete para conocer más.</li>}
                  </ul>
                  <div className="detail-note"><span aria-hidden="true">✳</span> Los precios y servicios se muestran según la información pública de la API.</div>
                </>
              )}
            </aside>
          </div>
          <div className="api-caption"><span className="live-dot" /> Información actualizada desde la API pública <code>GET /public/paquetes</code> · detalle <code>GET /public/paquetes/{'{id}'}</code></div>
        </section>

        <section className="content-section addon-section" id="adicionales">
          <div className="section-heading addon-heading">
            <div>
              <span className="eyebrow">02 — AGREGA UN DETALLE</span>
              <h2>Un poco más de <em>magia.</em></h2>
              <p>Servicios adicionales para completar la celebración.</p>
            </div>
            <label className="search-box">
              <span aria-hidden="true">⌕</span>
              <input value={addOnSearch} onChange={(event) => setAddOnSearch(event.target.value)} placeholder="Buscar productos" aria-label="Buscar productos adicionales" />
              <kbd>FILTRAR</kbd>
            </label>
          </div>
          <div className="addon-grid" aria-live="polite">
            {addOnsState.status === 'loading' && <StateMessage kind="loading" title="Cargando servicios adicionales" detail="Consultando las opciones públicas…" />}
            {addOnsState.status === 'error' && <StateMessage kind="error" title="No pudimos cargar los adicionales" detail={addOnsState.message} onRetry={() => void loadAddOns()} />}
            {addOnsState.status === 'ready' && filteredAddOns.length === 0 && <StateMessage kind="empty" title={addOnSearch ? 'No hay coincidencias' : 'No hay adicionales disponibles'} detail={addOnSearch ? 'Prueba con otra palabra.' : 'La API no devolvió opciones públicas en este momento.'} />}
            {addOnsState.status === 'ready' && filteredAddOns.map((item, index) => {
              const photo = imageUrl(item.productoAdicional?.imagenUrl);
              return (
                <article className="addon-card" key={item.id}>
                  <div className={`addon-image tint-${index % 4}`}>
                    {photo ? <img src={photo} alt={item.productoAdicional?.nombre ?? item.nombre} loading="lazy" /> : <span aria-hidden="true">✳</span>}
                    <span className="addon-badge">ADICIONAL</span>
                  </div>
                  <div className="addon-info">
                    <span className="addon-product">{item.productoAdicional?.nombre ?? 'SERVICIO EXTRA'}</span>
                    <h3>{item.nombre}</h3>
                    <p>{item.descripcion || item.productoAdicional?.descripcion || 'Una opción adicional para tu evento.'}</p>
                    <div className="addon-meta"><span>{item.cantidadIncluida ? `${item.cantidadIncluida} ${item.unidadMedida ?? 'unidades'}` : item.unidadMedida ?? 'Servicio'}</span><strong>{money(item.precioVentaColones)}</strong></div>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="api-caption"><span className="live-dot" /> Opciones públicas de productos adicionales <code>GET /public/opciones-productos-adicionales</code></div>
        </section>

        <section className="closing-band">
          <span className="eyebrow">VILLA PEÑAS · GUANACASTE</span>
          <p>Un espacio. <em>Mil recuerdos.</em></p>
          <a href="#inicio" aria-label="Volver al inicio">↑</a>
        </section>
      </main>

      <footer className="footer"><span>© 2026 VILLA PEÑAS</span><span>DATOS DE SERVICIOS PÚBLICOS · API REST</span><a href="#inicio">VOLVER ARRIBA ↑</a></footer>
    </div>
  );
}

export default App;
