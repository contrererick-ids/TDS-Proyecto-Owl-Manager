import { Navigate } from 'react-router-dom';

interface Props {
    children: React.ReactNode;
    allowedRoles?: string[]; // opcional: restringir por rol
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/auth/login" replace />;
    }

    // Si se especificaron roles, verificar que el usuario los tenga
    if (allowedRoles) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (!allowedRoles.includes(payload.role)) {
            return <Navigate to="/auth/login" replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;