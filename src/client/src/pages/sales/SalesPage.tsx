import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ISale, IClient, IUser } from '../../types/models';
import '../../../public/styles/pagelayout.css';

const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5v14"/>
  </svg>
);
const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
);
const IconSales = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatMXN(amount: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
}

function getName(ref: string | IUser | IClient | undefined): string {
  if (!ref) return '—';
  if (typeof ref === 'string') return ref;
  return (ref as IUser).name ?? (ref as IClient).name ?? '—';
}

export default function SalesPage() {
  const { user: authUser, token } = useAuth();
  const role    = authUser?.role?.toUpperCase();
  const isAdmin = role === 'ADMIN';
  const isAgent = role === 'AGENT';

  const [sales, setSales]       = useState<ISale[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [selected, setSelected] = useState<ISale | null>(null);

  // ── Fetch ──
  useEffect(() => {
    async function fetchSales() {
      setLoading(true);
      try {
        const res = await fetch('/api/sales', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setSales(Array.isArray(data) ? data : data.sales ?? []);
      } catch (err) {
        console.error('Error cargando ventas:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSales();
  }, [token]);

  // ── Filtro ──
  // Agent solo ve sus propias ventas
  const visibleSales = useMemo(() =>
    isAgent
      ? sales.filter(s => {
          const registeredId = typeof s.registeredBy === 'string'
            ? s.registeredBy
            : (s.registeredBy as IUser)._id;
          return registeredId === authUser?.id;
        })
      : sales,
    [sales, isAgent, authUser]);

  const filtered = useMemo(() =>
    visibleSales.filter(s =>
      getName(s.clientId).toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase()) ||
      getName(s.registeredBy).toLowerCase().includes(search.toLowerCase())
    ), [visibleSales, search]);

  // Total visible
  const total = useMemo(() =>
    filtered.reduce((acc, s) => acc + s.amount, 0), [filtered]);

  // ── Eliminar (solo Admin) ──
  async function deleteSale(sale: ISale) {
    if (!window.confirm('¿Seguro que deseas eliminar esta venta?')) return;
    try {
      await fetch(`/api/sales/${sale._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setSales(prev => prev.filter(s => s._id !== sale._id));
      setSelected(null);
    } catch (err) {
      console.error('Error eliminando venta:', err);
    }
  }

  return (
    <div className="page-root">

      {/* ── Encabezado ── */}
      <div className="page-header">
        <div className="page-header__left">
          <h1>Ventas</h1>
          <p>
            {filtered.length} venta{filtered.length !== 1 ? 's' : ''}
            {' · '}
            <span style={{ color: 'var(--accent)', fontWeight: 500 }}>
              {formatMXN(total)}
            </span>
          </p>
        </div>
        <div className="page-toolbar">
          <div className="page-search">
            <IconSearch />
            <input
              placeholder="Buscar por cliente, descripción o agente…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {/* Todos los roles pueden registrar ventas */}
          <button className="btn-primary">
            <IconPlus /> Nueva venta
          </button>
        </div>
      </div>

      {/* ── Cuerpo ── */}
      <div className="page-body">

        {/* Tabla */}
        <div className="table-wrap">
          <div className="table-scroll">
            {loading ? (
              <p className="table-loading">Cargando ventas…</p>
            ) : filtered.length === 0 ? (
              <p className="table-empty">No se encontraron ventas.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Monto</th>
                    <th>Descripción</th>
                    <th>Registrado por</th>
                    <th>Fecha de venta</th>
                    <th>Registrado el</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => (
                    <tr
                      key={s._id}
                      onClick={() => setSelected(s)}
                      className={selected?._id === s._id ? 'row--active' : ''}
                    >
                      <td>{getName(s.clientId)}</td>
                      <td style={{ color: 'var(--success)', fontWeight: 500 }}>
                        {formatMXN(s.amount)}
                      </td>
                      <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {s.description ?? <span style={{ color: 'var(--text-muted)' }}>—</span>}
                      </td>
                      <td>{getName(s.registeredBy)}</td>
                      <td>{formatDate(s.saleDate)}</td>
                      <td>{formatDate(s.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Panel de detalle */}
        {selected ? (
          <aside className="detail-panel">
            <div className="detail-panel__header">
              <span className="detail-panel__title">Detalle de venta</span>
              <button className="detail-panel__close" onClick={() => setSelected(null)}>
                <IconClose />
              </button>
            </div>

            <div className="detail-panel__body">
              <div className="detail-field">
                <span className="detail-field__label">Monto</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--success)' }}>
                  {formatMXN(selected.amount)}
                </span>
              </div>
              <div className="detail-field">
                <span className="detail-field__label">Cliente</span>
                <span className="detail-field__value">{getName(selected.clientId)}</span>
              </div>
              {selected.description && (
                <div className="detail-field">
                  <span className="detail-field__label">Descripción</span>
                  <span className="detail-field__value">{selected.description}</span>
                </div>
              )}
              <div className="detail-field">
                <span className="detail-field__label">Registrado por</span>
                <span className="detail-field__value">{getName(selected.registeredBy)}</span>
              </div>
              <hr className="detail-panel__divider" />
              <div className="detail-field">
                <span className="detail-field__label">Fecha de venta</span>
                <span className="detail-field__value">{formatDate(selected.saleDate)}</span>
              </div>
              <div className="detail-field">
                <span className="detail-field__label">Registrado el</span>
                <span className="detail-field__value">{formatDate(selected.createdAt)}</span>
              </div>
              <div className="detail-field">
                <span className="detail-field__label">Última actualización</span>
                <span className="detail-field__value">{formatDate(selected.updatedAt)}</span>
              </div>
            </div>

            {/* Acciones según rol */}
            <div className="detail-panel__actions">
              {/* Admin y Executive pueden editar */}
              {!isAgent && (
                <button className="btn-secondary" style={{ justifyContent: 'center' }}>
                  Editar venta
                </button>
              )}
              {/* Solo Admin puede eliminar */}
              {isAdmin && (
                <button
                  className="btn-danger"
                  style={{ justifyContent: 'center' }}
                  onClick={() => deleteSale(selected)}
                >
                  Eliminar venta
                </button>
              )}
            </div>
          </aside>
        ) : (
          <div className="detail-empty">
            <IconSales />
            <span>Selecciona una venta para ver su detalle</span>
          </div>
        )}

      </div>
    </div>
  );
}
