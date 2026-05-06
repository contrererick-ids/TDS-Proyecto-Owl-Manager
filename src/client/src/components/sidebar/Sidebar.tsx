import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../../public/styles/sidebar.css';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  items: NavItem[];
}

// ─── Iconos SVG inline ────────────────────────────────────────────────────────

export const IconTickets = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
    <path d="M13 5v14M9 9l1 1-1 1M9 13l1 1-1 1"/>
  </svg>
);

export const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

export const IconSales = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

export const IconClients = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    <line x1="12" y1="12" x2="12" y2="16"/>
    <line x1="10" y1="14" x2="14" y2="14"/>
  </svg>
);

const IconLogout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const IconChevron = ({ collapsed }: { collapsed: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
       style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

// ─── Logo del búho (versión compacta para sidebar) ────────────────────────────

const OwlMini = () => (
  <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" className="sidebar__owl">
    <circle cx="20" cy="18" r="13" fill="#E8A838" opacity="0.15"/>
    <circle cx="20" cy="18" r="10" fill="#1A2236"/>
    <circle cx="20" cy="18" r="9"  fill="#E8A838" opacity="0.1"/>
    <polygon points="14,9 11,3 18,8"  fill="#E8A838" opacity="0.7"/>
    <polygon points="26,9 29,3 22,8"  fill="#E8A838" opacity="0.7"/>
    <circle cx="15" cy="17" r="4" fill="#F0EDE6"/>
    <circle cx="25" cy="17" r="4" fill="#F0EDE6"/>
    <circle cx="15" cy="17" r="2.5" fill="#E8A838"/>
    <circle cx="25" cy="17" r="2.5" fill="#E8A838"/>
    <circle cx="16" cy="16" r="1"   fill="#F0EDE6"/>
    <circle cx="26" cy="16" r="1"   fill="#F0EDE6"/>
    <polygon points="20,21 17,25 23,25" fill="#E8A838" opacity="0.9"/>
  </svg>
);

// ─── Componente Sidebar ───────────────────────────────────────────────────────

export default function Sidebar({ items }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  // Iniciales del usuario para el avatar
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '??';

  const roleLabel: Record<string, string> = {
    admin:     'Administrador',
    executive: 'Ejecutivo',
    agent:     'Agente',
  };

  return (
    <nav className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>

      {/* ── Logo + nombre ── */}
      <div className="sidebar__brand">
        <OwlMini />
        {!collapsed && <span className="sidebar__brand-name">Owl Manager</span>}
      </div>

      {/* ── Nav items ── */}
      <ul className="sidebar__nav">
        {items.map(item => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
              }
              title={collapsed ? item.label : undefined}
            >
              <span className="sidebar__icon">{item.icon}</span>
              {!collapsed && <span className="sidebar__label">{item.label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* ── Footer: usuario + logout ── */}
      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__avatar">{initials}</div>
          {!collapsed && (
            <div className="sidebar__user-info">
              <span className="sidebar__user-name">{user?.name}</span>
              <span className="sidebar__user-role">
                {user?.role ? roleLabel[user.role] : ''}
              </span>
            </div>
          )}
        </div>

        <button
          className="sidebar__logout"
          onClick={handleLogout}
          title="Cerrar sesión"
        >
          <IconLogout />
        </button>
      </div>

      {/* ── Botón colapsar ── */}
      <button
        className="sidebar__collapse-btn"
        onClick={() => setCollapsed(v => !v)}
        title={collapsed ? 'Expandir' : 'Colapsar'}
      >
        <IconChevron collapsed={collapsed} />
      </button>

    </nav>
  );
}