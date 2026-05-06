// ─── AgentLayout.tsx ──────────────────────────────────────────────────────────
// Agent ve: Tickets, Ventas, Clientes (sin acceso a Usuarios)

import AppLayout from './AppLayout';
import {
  IconTickets,
  IconSales,
  IconClients,
} from '../components/sidebar/sidebar';

export default function AgentLayout() {
  return (
    <AppLayout
      navItems={[
        { to: '/tickets', label: 'Tickets',  icon: <IconTickets /> },
        { to: '/sales',   label: 'Ventas',   icon: <IconSales />   },
        { to: '/clients', label: 'Clientes', icon: <IconClients /> },
      ]}
    />
  );
}