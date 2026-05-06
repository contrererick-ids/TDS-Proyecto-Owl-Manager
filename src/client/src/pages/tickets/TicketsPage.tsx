import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ITicket, IClient, IUser,
  TicketStatus,
  TICKET_STATUS_LABEL, TICKET_STATUS_COLOR,
} from '../../types/models';
import '../../../public/styles/pagelayout.css';
import { set } from 'mongoose';

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
const IconTicket = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
  </svg>
);

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function getName(ref: string | IUser | IClient | undefined): string {
  if (!ref) return '—';
  if (typeof ref === 'string') return ref;
  return (ref as IUser).name ?? (ref as IClient).name ?? '—';
}

export default function TicketsPage() {
  const { user: authUser, token } = useAuth();
  const role = authUser?.role?.toUpperCase();
  const isAgent     = role === 'AGENT';
  const isAdmin     = role === 'ADMIN';
  const isExecutive = role === 'EXECUTIVE';

  const [tickets, setTickets]   = useState<ITicket[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [selected, setSelected] = useState<ITicket | null>(null);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'ALL'>('ALL');

  // ── Fetch ──
  useEffect(() => {
    async function fetchTickets() {
      setLoading(true);
      try {
        const res = await fetch(`/api/tickets/get-my-tickets/${authUser?.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTickets(Array.isArray(data) ? data : data.tickets ?? []);
      } catch (err) {
        console.error('Error cargando tickets:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, [token]);

  // ── Filtros ──
  const filtered = useMemo(() =>
    tickets.filter(t => {
      const matchSearch =
        t.ticketId.toLowerCase().includes(search.toLowerCase()) ||
        t.requestName.toLowerCase().includes(search.toLowerCase()) ||
        getName(t.clientId).toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
      return matchSearch && matchStatus;
    }), [tickets, search, statusFilter]);

  // ── Cambiar status (Agent, Admin, Executive) ──
  async function changeStatus(ticket: ITicket, newStatus: TicketStatus) {
    try {
      await fetch(`/api/tickets/${ticket._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      setTickets(prev => prev.map(t => t._id === ticket._id ? { ...t, status: newStatus } : t));
      setSelected(prev => prev?._id === ticket._id ? { ...prev, status: newStatus } : prev);
    } catch (err) {
      console.error('Error actualizando ticket:', err);
    }
  }

  // ── Reclamar ticket (Agent) ──
  async function claimTicket(ticket: ITicket) {
    try {
      await fetch(`/api/tickets/${ticket._id}/claim`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(prev => prev.map(t =>
        t._id === ticket._id ? { ...t, assignedTo: authUser?.id } : t
      ));
    } catch (err) {
      console.error('Error reclamando ticket:', err);
    }
  }

  return (
    <div className="page-root">

      {/* ── Encabezado ── */}
      <div className="page-header">
        <div className="page-header__left">
          <h1>Tickets</h1>
          <p>{tickets.length} ticket{tickets.length !== 1 ? 's' : ''} en total</p>
        </div>
        <div className="page-toolbar">
          {/* Filtro de estado */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as TicketStatus | 'ALL')}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '8px 12px', color: 'var(--text-secondary)',
              fontFamily: 'DM Sans, sans-serif', fontSize: '0.88rem', cursor: 'pointer',
            }}
          >
            <option value="ALL">Todos los estados</option>
            {Object.values(TicketStatus).map(s => (
              <option key={s} value={s}>{TICKET_STATUS_LABEL[s]}</option>
            ))}
          </select>

          <div className="page-search">
            <IconSearch />
            <input
              placeholder="Buscar por ID, asunto o cliente…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Admin y Executive pueden crear tickets */}
          {(isAdmin || isExecutive) && (
            <button className="btn-primary">
              <IconPlus /> Nuevo ticket
            </button>
          )}
        </div>
      </div>

      {/* ── Cuerpo ── */}
      <div className="page-body">

        {/* Tabla */}
        <div className="table-wrap">
          <div className="table-scroll">
            {loading ? (
              <p className="table-loading">Cargando tickets…</p>
            ) : filtered.length === 0 ? (
              <p className="table-empty">No se encontraron tickets.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Asunto</th>
                    <th>Cliente</th>
                    <th>Estado</th>
                    <th>Última modificación</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t => (
                    <tr
                      key={t._id}
                      onClick={() => setSelected(t)}
                      className={selected?._id === t._id ? 'row--active' : ''}
                    >
                      <td style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--accent)' }}>
                        {t.ticketId}
                      </td>
                      <td>{t.requestName}</td>
                      <td>{getName(t.clientId)}</td>
                      <td>
                        <span className="badge" style={{
                          backgroundColor: `${TICKET_STATUS_COLOR[t.status]}18`,
                          color: TICKET_STATUS_COLOR[t.status],
                        }}>
                          {TICKET_STATUS_LABEL[t.status]}
                        </span>
                      </td>
                      <td>{formatDate(t.lastModifiedDate)}</td>
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
              <span className="detail-panel__title">{selected.ticketId}</span>
              <button className="detail-panel__close" onClick={() => setSelected(null)}>
                <IconClose />
              </button>
            </div>

            <div className="detail-panel__body">
              <div className="detail-field">
                <span className="detail-field__label">Asunto</span>
                <span className="detail-field__value">{selected.requestName}</span>
              </div>
              <div className="detail-field">
                <span className="detail-field__label">Estado</span>
                <span className="badge" style={{
                  width: 'fit-content',
                  backgroundColor: `${TICKET_STATUS_COLOR[selected.status]}18`,
                  color: TICKET_STATUS_COLOR[selected.status],
                }}>
                  {TICKET_STATUS_LABEL[selected.status]}
                </span>
              </div>
              <div className="detail-field">
                <span className="detail-field__label">Cliente</span>
                <span className="detail-field__value">{getName(selected.clientId)}</span>
              </div>
              <div className="detail-field">
                <span className="detail-field__label">Creado por</span>
                <span className="detail-field__value">{getName(selected.createdBy)}</span>
              </div>
              {selected.cancelReason && (
                <div className="detail-field">
                  <span className="detail-field__label">Motivo de cancelación</span>
                  <span className="detail-field__value">{selected.cancelReason}</span>
                </div>
              )}
              <div className="detail-field">
                <span className="detail-field__label">Última modificación</span>
                <span className="detail-field__value">{formatDate(selected.lastModifiedDate)}</span>
              </div>

              {/* Comentarios */}
              {selected.comments.length > 0 && (
                <>
                  <hr className="detail-panel__divider" />
                  <div className="detail-field">
                    <span className="detail-field__label">Comentarios ({selected.comments.length})</span>
                    {selected.comments.map((c, i) => (
                      <div key={i} style={{
                        marginTop: 8, padding: '8px 10px',
                        background: 'var(--bg-input)', borderRadius: 6,
                        border: '1px solid var(--border)',
                      }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                          {getName(c.commentAuthorId)} · {formatDate(c.createdAt)}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{c.text}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Acciones según rol */}
            <div className="detail-panel__actions">
              {/* Agent: solo cambiar status y reclamar */}
              {isAgent && (
                <>
                  <button className="btn-secondary" style={{ justifyContent: 'center' }}
                    onClick={() => claimTicket(selected)}>
                    Reclamar ticket
                  </button>
                  <select
                    value={selected.status}
                    onChange={e => changeStatus(selected, e.target.value as TicketStatus)}
                    style={{
                      background: 'var(--bg-input)', border: '1px solid var(--border)',
                      borderRadius: 8, padding: '9px 12px', color: 'var(--text-secondary)',
                      fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', cursor: 'pointer', width: '100%',
                    }}
                  >
                    {Object.values(TicketStatus).map(s => (
                      <option key={s} value={s}>{TICKET_STATUS_LABEL[s]}</option>
                    ))}
                  </select>
                </>
              )}

              {/* Admin / Executive: editar completo + cambiar status */}
              {(isAdmin || isExecutive) && (
                <>
                  <button className="btn-secondary" style={{ justifyContent: 'center' }}>
                    Editar ticket
                  </button>
                  <select
                    value={selected.status}
                    onChange={e => changeStatus(selected, e.target.value as TicketStatus)}
                    style={{
                      background: 'var(--bg-input)', border: '1px solid var(--border)',
                      borderRadius: 8, padding: '9px 12px', color: 'var(--text-secondary)',
                      fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', cursor: 'pointer', width: '100%',
                    }}
                  >
                    {Object.values(TicketStatus).map(s => (
                      <option key={s} value={s}>{TICKET_STATUS_LABEL[s]}</option>
                    ))}
                  </select>
                  {isAdmin && (
                    <button className="btn-danger" style={{ justifyContent: 'center' }}>
                      Eliminar ticket
                    </button>
                  )}
                </>
              )}
            </div>
          </aside>
        ) : (
          <div className="detail-empty">
            <IconTicket />
            <span>Selecciona un ticket para ver su detalle</span>
          </div>
        )}

      </div>
    </div>
  );
}
