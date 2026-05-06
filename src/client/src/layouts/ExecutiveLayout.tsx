// ─── ExecutiveLayout.tsx ──────────────────────────────────────────────────────
// Executive ve: Tickets, Ventas, Clientes, Usuarios (solo lectura en Usuarios)
// El control de permisos internos va en cada página, no en el layout.

import AppLayout from './AppLayout';
import {
  IconTickets,
  IconSales,
  IconClients,
  IconUsers,
} from '../components/sidebar/sidebar';

export default function ExecutiveLayout() {
  return (
    <AppLayout
      navItems={[
        { to: '/tickets', label: 'Tickets',  icon: <IconTickets /> },
        { to: '/sales',   label: 'Ventas',   icon: <IconSales />   },
        { to: '/clients', label: 'Clientes', icon: <IconClients /> },
        { to: '/users',   label: 'Usuarios', icon: <IconUsers />   },
      ]}
    />
  );
}