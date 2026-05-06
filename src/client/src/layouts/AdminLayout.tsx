// ─── AdminLayout.tsx ──────────────────────────────────────────────────────────
// Admin ve: Tickets, Ventas, Clientes, Usuarios

import AppLayout from './AppLayout';
import {
  IconTickets,
  IconSales,
  IconClients,
  IconUsers,
} from '../components/sidebar/sidebar';

export default function AdminLayout() {
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