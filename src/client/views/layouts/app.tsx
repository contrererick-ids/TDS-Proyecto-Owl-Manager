import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';
import Dashboard from './dashboard';
import ProtectedRoute from '../../components/ProtectedRoute';

const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Navigate to="/auth/login" replace />} />
            <Route path="/auth/login" element={<Login />} />

            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            } />

            <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['Administrador']}>
                    <div>Solo admins</div>
                </ProtectedRoute>
            } />
        </Routes>
    </BrowserRouter>
);

export default App;