import ReactDOM from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './router/AppRouter';
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
  <AuthProvider>
    <>
    <AppRouter />
    <Toaster position="top-right" />
    </>
  </AuthProvider>
)
