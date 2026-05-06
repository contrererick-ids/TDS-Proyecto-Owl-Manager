import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';

// Layouts (uno por rol — los crearás después)
import AdminLayout from '../layouts/AdminLayout';
import ExecutiveLayout from '../layouts/ExecutiveLayout';
import AgentLayout from '../layouts/AgentLayout';

// Páginas compartidas entre roles
import TicketsPage from '../pages/tickets/TicketsPage';
import SalesPage from '../pages/sales/SalesPage';
import ClientsPage from '../pages/clients/ClientsPage';

// Páginas exclusivas de Admin / Executive
import UsersPage from '../pages/users/UsersPage';

// Página pública
import LoginPage from '../pages/Login';

// Redirige al login si no hay sesión activa.
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  // El rol viene en mayúsculas desde el JWT del backend (ADMIN, EXECUTIVE, AGENT)
  return <Navigate to="/tickets" replace />;
}

function RoleLayout() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  // Normaliza a mayúsculas para que coincida con lo que devuelve el JWT
  switch (user.role.toUpperCase()) {
    case 'ADMIN':     return <AdminLayout />;
    case 'EXECUTIVE': return <ExecutiveLayout />;
    case 'AGENT':     return <AgentLayout />;
    default:          return <Navigate to="/login" replace />;
  }
}

function ProtectedRoutes() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <Routes>
      {/* Shell: sidebar + outlet */}
      <Route element={<RoleLayout />}>

        {/* Rutas compartidas por los 3 roles */}
        <Route path="/tickets" element={<TicketsPage />} />
        <Route path="/sales"   element={<SalesPage />} />
        <Route path="/clients" element={<ClientsPage />} />

        {/* Solo Admin y Executive pueden ver /users */}
        {(['ADMIN', 'EXECUTIVE'].includes(user.role.toUpperCase())) && (
          <Route path="/users" element={<UsersPage />} />
        )}

        {/* Cualquier ruta no reconocida redirige al home del rol */}
        <Route path="*" element={<Navigate to="/tickets" replace />} />
      </Route>
    </Routes>
  );
}

export default function AppRouter() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route
          path="/login"
          element={
            isAuthenticated
              ? <RoleRedirect />   // ya logueado → va a su dashboard
              : <LoginPage />
          }
        />

        {/* Raíz → redirige según estado */}
        <Route
          path="/"
          element={
            isAuthenticated
              ? <RoleRedirect />
              : <Navigate to="/login" replace />
          }
        />

        {/* Rutas protegidas */}
        <Route
          path="/*"
          element={
            <RequireAuth>
              <ProtectedRoutes />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
