import { Outlet } from 'react-router-dom';
import Sidebar, { NavItem } from '../components/sidebar/sidebar';
import '../../public/styles/applayout.css';

interface AppLayoutProps {
  navItems: NavItem[];
}

export default function AppLayout({ navItems }: AppLayoutProps) {
  return (
    <div className="app-shell">
      <Sidebar items={navItems} />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
