import ReactDOM from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
// El orden importa: AuthProvider → SocketProvider (necesita token) → NotificationProvider (necesita socket)
import { SocketProvider } from './context/socketContext';
import { NotificationProvider } from './context/NotificationsContext';
import AppRouter from './router/AppRouter';
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <AuthProvider>
    <SocketProvider>
      <NotificationProvider>
        <>
          <AppRouter />
          <Toaster position="top-right" />
        </>
      </NotificationProvider>
    </SocketProvider>
  </AuthProvider>
);