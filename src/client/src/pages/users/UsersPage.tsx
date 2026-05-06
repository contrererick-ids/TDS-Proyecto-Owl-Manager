import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { IUser, UserRole, USER_ROLE_LABEL } from '../../types/models';
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
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

function roleColor(role: UserRole): string {
  return role === UserRole.ADMIN     ? '#f59e0b'
       : role === UserRole.EXECUTIVE ? '#60a5fa'
       : '#a78bfa';
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function UsersPage() {
  const { user: authUser, token } = useAuth();
  const isAdmin = authUser?.role?.toUpperCase() === 'ADMIN';

  const [users, setUsers]       = useState<IUser[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [selected, setSelected] = useState<IUser | null>(null);

  // ── Fetch ──
  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const res = await fetch('/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : data.users ?? []);
      } catch (err) {
        console.error('Error cargando usuarios:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [token]);

  // ── Filtro ──
  const filtered = useMemo(() =>
    users.filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    ), [users, search]);

  // ── Toggle activo (solo Admin) ──
  async function toggleActive(u: IUser) {
    try {
      await fetch(`/api/users/${u._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isActive: !u.isActive }),
      });
      setUsers(prev => prev.map(x => x._id === u._id ? { ...x, isActive: !x.isActive } : x));
      setSelected(prev => prev?._id === u._id ? { ...prev, isActive: !prev.isActive } : prev);
    } catch (err) {
      console.error('Error actualizando usuario:', err);
    }
  }

  return (
    <div className="page-root">

      {/* ── Encabezado ── */}
      <div className="page-header">
        <div className="page-header__left">
          <h1>Usuarios</h1>
          <p>{users.length} usuario{users.length !== 1 ? 's' : ''} registrado{users.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="page-toolbar">
          <div className="page-search">
            <IconSearch />
            <input
              placeholder="Buscar por nombre, usuario o correo…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {/* Solo Admin puede crear usuarios */}
          {isAdmin && (
            <button className="btn-primary">
              <IconPlus /> Nuevo usuario
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
              <p className="table-loading">Cargando usuarios…</p>
            ) : filtered.length === 0 ? (
              <p className="table-empty">No se encontraron usuarios.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Usuario</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Creado</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => (
                    <tr
                      key={u._id}
                      onClick={() => setSelected(u)}
                      className={selected?._id === u._id ? 'row--active' : ''}
                    >
                      <td>{u.name}</td>
                      <td style={{ color: 'var(--text-muted)' }}>@{u.username}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className="badge" style={{
                          backgroundColor: `${roleColor(u.role)}18`,
                          color: roleColor(u.role),
                        }}>
                          {USER_ROLE_LABEL[u.role]}
                        </span>
                      </td>
                      <td>
                        <span className="badge" style={{
                          backgroundColor: u.isActive ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)',
                          color: u.isActive ? 'var(--success)' : 'var(--danger)',
                        }}>
                          {u.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>{formatDate(u.createdAt)}</td>
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
              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'var(--accent-dim)', border: '1.5px solid var(--border)',
                  color: 'var(--accent)', fontFamily: 'DM Sans', fontSize: '1rem', fontWeight: 500,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {selected.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                </div>
                <div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{selected.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>@{selected.username}</div>
                </div>
              </div>

              <hr className="detail-panel__divider" />

              <div className="detail-field">
                <span className="detail-field__label">Correo electrónico</span>
                <span className="detail-field__value">{selected.email}</span>
              </div>
              <div className="detail-field">
                <span className="detail-field__label">Rol</span>
                <span className="badge" style={{
                  width: 'fit-content',
                  backgroundColor: `${roleColor(selected.role)}18`,
                  color: roleColor(selected.role),
                }}>
                  {USER_ROLE_LABEL[selected.role]}
                </span>
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
              <div className="detail-field">
                <span className="detail-field__label">Registrado el</span>
                <span className="detail-field__value">{formatDate(selected.createdAt)}</span>
              </div>
              <div className="detail-field">
                <span className="detail-field__label">Última actualización</span>
                <span className="detail-field__value">{formatDate(selected.updatedAt)}</span>
              </div>
            </div>

            {/* Acciones — solo Admin puede modificar */}
            {isAdmin && (
              <div className="detail-panel__actions">
                <button className="btn-secondary" style={{ justifyContent: 'center' }}>
                  Editar usuario
                </button>
                <button
                  className={selected.isActive ? 'btn-danger' : 'btn-secondary'}
                  style={{ justifyContent: 'center' }}
                  onClick={() => toggleActive(selected)}
                >
                  {selected.isActive ? 'Desactivar usuario' : 'Activar usuario'}
                </button>
              </div>
            )}
          </aside>
        ) : (
          <div className="detail-empty">
            <IconUser />
            <span>Selecciona un usuario para ver su detalle</span>
          </div>
        )}

      </div>
    </div>
  );
}
