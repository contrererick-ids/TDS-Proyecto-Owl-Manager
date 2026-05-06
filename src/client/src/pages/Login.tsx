import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../../public/styles/login.css';

// Iconos SVG para los campos de entrada (inline para evitar dependencias externas)
const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
       fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const IconLock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
       fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const IconEye = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
       fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const IconEyeOff = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
       fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
    <line x1="2" y1="2" x2="22" y2="22"/>
  </svg>
);

// SVG decorativo del búho
const OwlLogo = () => (
  <svg className="login-side__owl" viewBox="0 0 120 120"
       xmlns="http://www.w3.org/2000/svg">
    {/* Cuerpo */}
    <ellipse cx="60" cy="72" rx="34" ry="38" fill="#E8A838" opacity="0.15"/>
    <ellipse cx="60" cy="72" rx="28" ry="32" fill="#E8A838" opacity="0.25"/>
    {/* Alas */}
    <ellipse cx="26" cy="75" rx="18" ry="10" fill="#E8A838" opacity="0.4" transform="rotate(-20 26 75)"/>
    <ellipse cx="94" cy="75" rx="18" ry="10" fill="#E8A838" opacity="0.4" transform="rotate(20 94 75)"/>
    {/* Cabeza */}
    <circle cx="60" cy="44" r="26" fill="#E8A838" opacity="0.3"/>
    <circle cx="60" cy="44" r="22" fill="#1A2236"/>
    <circle cx="60" cy="44" r="20" fill="#E8A838" opacity="0.2"/>
    {/* Orejas */}
    <polygon points="42,24 36,10 50,20" fill="#E8A838" opacity="0.6"/>
    <polygon points="78,24 84,10 70,20" fill="#E8A838" opacity="0.6"/>
    {/* Ojos */}
    <circle cx="50" cy="42" r="9" fill="#F0EDE6"/>
    <circle cx="70" cy="42" r="9" fill="#F0EDE6"/>
    <circle cx="50" cy="42" r="6" fill="#1A2236"/>
    <circle cx="70" cy="42" r="6" fill="#1A2236"/>
    <circle cx="50" cy="42" r="4" fill="#E8A838"/>
    <circle cx="70" cy="42" r="4" fill="#E8A838"/>
    <circle cx="52" cy="40" r="1.5" fill="#F0EDE6"/>
    <circle cx="72" cy="40" r="1.5" fill="#F0EDE6"/>
    {/* Pico */}
    <polygon points="60,50 55,56 65,56" fill="#E8A838" opacity="0.9"/>
    {/* Pecho */}
    <ellipse cx="60" cy="80" rx="16" ry="20" fill="#E8A838" opacity="0.12"/>
    {/* Patas */}
    <line x1="50" y1="104" x2="44" y2="112" stroke="#E8A838" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
    <line x1="50" y1="104" x2="50" y2="113" stroke="#E8A838" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
    <line x1="70" y1="104" x2="76" y2="112" stroke="#E8A838" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
    <line x1="70" y1="104" x2="70" y2="113" stroke="#E8A838" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
  </svg>
);

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername]   = useState('');
  const [password, setPassword]   = useState('');
  const [remember, setRemember]   = useState(false);
  const [showPass, setShowPass]   = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? 'Credenciales incorrectas.');
        return;
      }

      login(data.token);       // guarda el JWT en AuthContext + localStorage
      navigate('/tickets');    // AppRouter redirigirá según el rol

    } catch {
      setError('No se pudo conectar con el servidor. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-root">

      {/* ── Panel lateral ── */}
      <aside className="login-side">
        <OwlLogo />
        <h1 className="login-side__title">Owl Manager</h1>
        <p className="login-side__sub">Sistema de gestión empresarial</p>
        <div className="login-side__roles">
          <span>Admin</span>
          <span className="sep">·</span>
          <span>Executive</span>
          <span className="sep">·</span>
          <span>Agent</span>
        </div>
      </aside>

      {/* ── Panel principal ── */}
      <main className="login-main">
        <div className="login-card">

          <div className="login-card__header">
            <h2>Bienvenido de vuelta</h2>
            <p>Ingresa tus credenciales para continuar</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>

            {/* Username */}
            <div className="field">
              <label htmlFor="username">Nombre de usuario</label>
              <div className="field__input-wrap">
                <span className="field__icon"><IconUser /></span>
                <input
                  id="username"
                  type="text"
                  placeholder="usuario"
                  autoComplete="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="field">
              <label htmlFor="password">Contraseña</label>
              <div className="field__input-wrap">
                <span className="field__icon"><IconLock /></span>
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="field__toggle"
                  onClick={() => setShowPass(v => !v)}
                  aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPass ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
            </div>

            {/* Opciones */}
            <div className="login-form__options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                <span className="checkbox-custom" />
                Recordarme
              </label>
              <a href="#" className="forgot-link">¿Olvidaste tu contraseña?</a>
            </div>

            {/* Error */}
            {error && (
              <p style={{
                fontSize: '0.82rem',
                color: '#f87171',
                background: 'rgba(248,113,113,0.08)',
                border: '1px solid rgba(248,113,113,0.2)',
                borderRadius: '6px',
                padding: '9px 12px',
              }}>
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="btn-login"
              disabled={loading}
            >
              {loading ? 'Ingresando…' : 'Ingresar'}
            </button>

          </form>

          <p className="login-card__note">
            Acceso restringido · Solo personal autorizado
          </p>

        </div>
      </main>
    </div>
  );
}