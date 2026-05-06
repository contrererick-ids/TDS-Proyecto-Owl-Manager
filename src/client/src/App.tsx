import ReactDOM from 'react-dom/client';
import { AuthProvider } from './context/AuthContext'
import AppRouter from './router/AppRouter'

const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
  <AuthProvider>
    <AppRouter />
  </AuthProvider>
)
