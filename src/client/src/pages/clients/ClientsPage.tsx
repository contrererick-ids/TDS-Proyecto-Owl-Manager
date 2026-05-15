import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { IClient, IUser } from '../../types/models';
import '../../../public/styles/pagelayout.css';
import ClientFormModal from '../../components/modals/ClientFormModal';
import toast from 'react-hot-toast';


// ─── Iconos ───────────────────────────────────────────────────────────────────

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
const IconClients = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}


function getName(ref: string | IUser | undefined): string {

  if (!ref) return '—';

  if (typeof ref === 'string') {

    // Detectar ObjectId Mongo
    const isMongoId =
      /^[a-f0-9]{24}$/i.test(ref);

    if (isMongoId) {
      return '—';
    }

    return ref;
  }

  return ref.name ?? '—';
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function ClientsPage() {
  const { user: authUser, token } = useAuth();
  const role    = authUser?.role?.toUpperCase();
  const isAdmin = role === 'ADMIN';
  const isAgent = role === 'AGENT';
  const isExecutive = role === 'EXECUTIVE';
  // Executive y Admin pueden crear/editar; Agent solo consulta

  const [clients, setClients]   = useState<IClient[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [selected, setSelected] = useState<IClient | null>(null);

  // modal crear cliente
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] =
    useState<'create' | 'edit'>('create');
  const [selectedClient, setSelectedClient] =
    useState<IClient | null>(null);
  // modal executive dentro de crear cliente
  const [executives, setExecutives] = useState<any[]>([]);
  // eliminar cliente
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = 
    useState<IClient | null>(null);

  // ── Fetch ──
  useEffect(() => {
    async function fetchClients() {
      setLoading(true);
      try {
        const res = await fetch('/api/clients/get-all-clients', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('Error cargando clientes');
        }
        const data = await res.json();
        setClients(Array.isArray(data) ? data : data.clients ?? []);
      } catch (err) {
        toast.error('Error cargando clientes');
      } finally {
        setLoading(false);
      }
    }
    
    async function fetchExecutives() {
      
      try {
        
        const response = await fetch(
          '/api/users/get-all-users',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        const users = await response.json();
        
        setExecutives(
          users.filter(
            (u: any) =>
              u.role === 'EXECUTIVE'
          )
        );
        
      } catch (err) {
        
        console.error(
          'Error loading executives:',
          err
        );
      }
    }

    fetchClients();
    if (!isAgent) {
      fetchExecutives();
    }

  }, [token]);

  // ── Filtro ──
  const filtered = useMemo(() =>
    clients.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
    ), [clients, search]);

  // ── Desactivar (Admin o Executive) ──
  async function toggleActive(c: IClient) {

    try {

      const response = await fetch(
        `/api/clients/toggle-client-status/${c._id}`,
        {
          method: 'PATCH',

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      console.log(result.assignedTo);

      if (!response.ok) {
        throw new Error(
          result.message
        );
      }

      setClients(prev =>
        prev.map(x =>
          x._id === c._id
            ? result
            : x
        )
      );

      setSelected(prev =>
        prev?._id === c._id
          ? result
          : prev
      );

      toast.success(
        `Cliente ${
          result.isActive
            ? 'activado'
            : 'desactivado'
        }`
      );

    } catch (err: any) {

      toast.error(
        err.message ||
        'Error actualizando cliente'
      );
    }
  }

  async function handleCreateClient(
    data: any
  ) {

    try {

      const response = await fetch(
        '/api/clients/new-client',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      toast.success('Cliente creado');

      setIsModalOpen(false);

      window.location.reload();

    } catch (error: any) {

      toast.error(
        error.message || 'Error creating client'
      );
    }
  }

  async function handleEditClient(
    data: any
  ) {

    if (!selectedClient) return;

    try {

      const response = await fetch(
        `/api/clients/update-client/${selectedClient._id}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      toast.success('Cliente actualizado');

      setIsModalOpen(false);

      window.location.reload();

    } catch (error: any) {

      toast.error(
        error.message || 'Error updating client'
      );
    }
  }


  async function confirmDeleteClient() {

    if (!clientToDelete) return;

    try {

      const response = await fetch(
        `/api/clients/delete-client/${clientToDelete._id}`,
        {
          method: 'DELETE',

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result =
        await response.json();

      if (!response.ok) {

        throw new Error(
          result.message
        );
      }

      setClients(prev =>
        prev.filter(
          c =>
            c._id !== clientToDelete._id
        )
      );

      setSelected(null);

      setDeleteModalOpen(false);

      setClientToDelete(null);

      toast.success(
        'Cliente eliminado'
      );

    } catch (error: any) {

      toast.error(
        error.message ||
        'Error eliminando cliente'
      );
    }
  }



  return (
    <div className="page-root">

      {/* ── Encabezado ── */}
      <div className="page-header">
        <div className="page-header__left">
          <h1>Clientes</h1>
          <p>{clients.length} cliente{clients.length !== 1 ? 's' : ''} registrado{clients.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="page-toolbar">
          <div className="page-search">
            <IconSearch />
            <input
              placeholder="Buscar por nombre, empresa o correo…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {/* Admin y Executive pueden crear clientes */}
          {!isAgent && (
            <button
              className="btn-primary"
              onClick={() => {

                setModalMode('create');

                setSelectedClient(null);

                setIsModalOpen(true);
              }}
            >
              <IconPlus /> Nuevo cliente
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
              <p className="table-loading">Cargando clientes…</p>
            ) : filtered.length === 0 ? (
              <p className="table-empty">No se encontraron clientes.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Empresa</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Asignado a</th>
                    <th>Estado</th>
                    <th>Registrado</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(c => (
                    <tr
                      key={c._id}
                      onClick={() => setSelected(c)}
                      className={selected?._id === c._id ? 'row--active' : ''}
                    >
                      <td>{c.name}</td>
                      <td>{c.company ?? <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                      <td>{c.email ?? <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                      <td>{c.phone ?? <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                      <td>{getName(c.assignedTo)}</td>
                      <td>
                        <span className="badge" style={{
                          backgroundColor: c.isActive ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)',
                          color: c.isActive ? 'var(--success)' : 'var(--danger)',
                        }}>
                          {c.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>{formatDate(c.createdAt)}</td>
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
              <span className="detail-panel__title">Detalle</span>
              <button className="detail-panel__close" onClick={() => setSelected(null)}>
                <IconClose />
              </button>
            </div>

            <div className="detail-panel__body">
              <div className="detail-field">
                <span className="detail-field__label">Nombre</span>
                <span className="detail-field__value">{selected.name}</span>
              </div>
              {selected.company && (
                <div className="detail-field">
                  <span className="detail-field__label">Empresa</span>
                  <span className="detail-field__value">{selected.company}</span>
                </div>
              )}
              {selected.email && (
                <div className="detail-field">
                  <span className="detail-field__label">Correo electrónico</span>
                  <span className="detail-field__value">{selected.email}</span>
                </div>
              )}
              {selected.phone && (
                <div className="detail-field">
                  <span className="detail-field__label">Teléfono</span>
                  <span className="detail-field__value">{selected.phone}</span>
                </div>
              )}
              <div className="detail-field">
                <span className="detail-field__label">Asignado a</span>
                <span className="detail-field__value">{getName(selected.assignedTo)}</span>
              </div>
              <div className="detail-field">
                <span className="detail-field__label">Estado</span>
                <span className="badge" style={{
                  width: 'fit-content',
                  backgroundColor: selected.isActive ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)',
                  color: selected.isActive ? 'var(--success)' : 'var(--danger)',
                }}>
                  {selected.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <hr className="detail-panel__divider" />
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
            {!isAgent && (
              <div className="detail-panel__actions">
                <button
                  className="btn-secondary"
                  style={{ justifyContent: 'center' }}
                  onClick={() => {

                    setModalMode('edit');

                    setSelectedClient(selected);

                    setIsModalOpen(true);
                  }}
                >
                  Editar cliente
                </button>
                {(isAdmin || isExecutive) && (
                  <button
                    className={
                      selected.isActive
                        ? 'btn-danger'
                        : 'btn-secondary'
                    }
                    style={{
                      justifyContent: 'center'
                    }}
                    onClick={() =>
                      toggleActive(selected)
                    }
                  >
                    {
                      selected.isActive
                        ? 'Desactivar cliente'
                        : 'Activar cliente'
                    }
                  </button>
                  
                )}

                {isAdmin && (

                  <button
                    className="btn-danger"
                    style={{
                      justifyContent: 'center'
                    }}
                    onClick={() => {

                      setClientToDelete(
                        selected
                      );

                      setDeleteModalOpen(true);
                    }}
                  >
                    Eliminar cliente
                  </button>

                )}

              </div>
            )}
          </aside>
        ) : (
          <div className="detail-empty">
            <IconClients />
            <span>Selecciona un cliente para ver su detalle</span>
          </div>
        )}

      </div>


      <ClientFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        initialData={selectedClient}
        executives={executives}
        onSubmit={
          modalMode === 'create'
            ? handleCreateClient
            : handleEditClient
        }
      />

      {
        deleteModalOpen && (

          <div className="modal-overlay">

            <div
              className="modal-card"
              style={{
                maxWidth: '420px'
              }}
            >

              <div className="modal-header">

                <h2 className="modal-title">
                  Delete Client
                </h2>

                <button
                  className="modal-close"
                  onClick={() => {

                    setDeleteModalOpen(false);

                    setClientToDelete(null);
                  }}
                >
                  ✕
                </button>

              </div>

              <div
                style={{
                  padding: '10px 0 24px 0',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                }}
              >

                Estas seguro de querer eliminar el cliente:

                <br /><br />

                <strong
                  style={{
                    color: 'var(--text-primary)'
                  }}
                >
                  {clientToDelete?.name}
                </strong>

                <br />

                <span
                  style={{
                    color: 'var(--accent)',
                    fontSize: '0.85rem',
                  }}
                >
                  {clientToDelete?.company}
                </span>

                <br /><br />

                Esta acción es permanente.

              </div>

              <div
                className="modal-footer"
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                }}
              >

                <button
                  className="modal-secondary-button"
                  onClick={() => {

                    setDeleteModalOpen(false);

                    setClientToDelete(null);
                  }}
                >
                  Cancel
                </button>

                <button
                  className="btn-danger"
                  onClick={confirmDeleteClient}
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        )
      }


    </div>
  );
}
