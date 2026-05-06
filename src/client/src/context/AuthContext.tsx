import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type UserRole = string;   // el backend devuelve 'ADMIN' | 'EXECUTIVE' | 'AGENT'

export interface AuthUser {
  id: string;
  name: string;
  email?: string;   // el JWT del backend no incluye email
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// ─── Utilidad: decodificar JWT sin librería externa ───────────────────────────

function decodeJWT(token: string): AuthUser | null {
  try {
    const payload = token.split('.')[1];
    // El payload está en base64url — lo convertimos a base64 estándar
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    const decoded = JSON.parse(json);

    // Verifica que el token no haya expirado
    if (decoded.exp && Date.now() / 1000 > decoded.exp) {
      return null;
    }

    // Ajusta los nombres de campos según lo que devuelva tu backend
    return {
      id: decoded.id ?? decoded._id ?? decoded.sub,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role as UserRole,
    };
  } catch {
    return null;
  }
}

// ─── Contexto ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('owl_token')
  );
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('owl_token');
    return stored ? decodeJWT(stored) : null;
  });

  // Si el token cambia (p.ej. se guarda desde fuera), sincroniza el usuario
  useEffect(() => {
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded) {
        setUser(decoded);
      } else {
        // Token inválido o expirado — limpiar sesión
        logout();
      }
    } else {
      setUser(null);
    }
  }, [token]);

  function login(newToken: string) {
    localStorage.setItem('owl_token', newToken);
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem('owl_token');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return ctx;
}
