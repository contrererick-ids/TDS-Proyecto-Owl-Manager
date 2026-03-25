import React, { useState } from 'react';
import '../../public/styles/login.css';

const Login: React.FC = () => {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [recordar, setRecordar] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ usuario, contrasena, recordar });
    // Pendiente lógica de autenticación
  };

  return (
    <div className="login-root">
      {/* Panel izquierdo — decorativo */}
      <aside className="login-side">
        <div className="login-side__owl">
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            {/* cuerpo */}
            <ellipse cx="60" cy="72" rx="32" ry="38" fill="var(--accent)" opacity="0.18"/>
            <ellipse cx="60" cy="72" rx="24" ry="30" fill="var(--accent)" opacity="0.28"/>
            {/* alas */}
            <path d="M28 80 Q10 60 28 45 Q36 68 44 75Z" fill="var(--accent)" opacity="0.5"/>
            <path d="M92 80 Q110 60 92 45 Q84 68 76 75Z" fill="var(--accent)" opacity="0.5"/>
            {/* cabeza */}
            <ellipse cx="60" cy="42" rx="22" ry="20" fill="var(--accent)" opacity="0.6"/>
            {/* orejas */}
            <polygon points="44,26 38,10 52,22" fill="var(--accent)" opacity="0.7"/>
            <polygon points="76,26 82,10 68,22" fill="var(--accent)" opacity="0.7"/>
            {/* ojos */}
            <circle cx="52" cy="42" r="8" fill="var(--bg)"/>
            <circle cx="68" cy="42" r="8" fill="var(--bg)"/>
            <circle cx="52" cy="42" r="5" fill="var(--accent)"/>
            <circle cx="68" cy="42" r="5" fill="var(--accent)"/>
            <circle cx="53.5" cy="40.5" r="1.5" fill="var(--bg)"/>
            <circle cx="69.5" cy="40.5" r="1.5" fill="var(--bg)"/>
            {/* pico */}
            <polygon points="57,50 63,50 60,55" fill="var(--bg)" opacity="0.8"/>
          </svg>
        </div>
        <h1 className="login-side__title">Owl Manager</h1>
        <p className="login-side__sub">Sistema de gestión interno</p>
        <div className="login-side__roles">
          <span>Admin</span>
          <span className="sep">·</span>
          <span>Ejecutivo</span>
          <span className="sep">·</span>
          <span>Agente</span>
        </div>
      </aside>

      {/* Panel derecho — formulario */}
      <main className="login-main">
        <div className="login-card">
          <div className="login-card__header">
            <h2>Iniciar sesión</h2>
            <p>Ingresa tus credenciales para continuar</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {/* Usuario */}
            <div className="field">
              <label htmlFor="usuario">Usuario</label>
              <div className="field__input-wrap">
                <span className="field__icon" aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0H3z"/></svg>
                </span>
                <input
                  id="usuario"
                  type="text"
                  autoComplete="username"
                  placeholder="Nombre de usuario"
                  value={usuario}
                  onChange={e => setUsuario(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="field">
              <label htmlFor="contrasena">Contraseña</label>
              <div className="field__input-wrap">
                <span className="field__icon" aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v2H5a1 1 0 00-1 1v7a1 1 0 001 1h10a1 1 0 001-1V9a1 1 0 00-1-1h-1V6a4 4 0 00-4-4zm0 2a2 2 0 012 2v2H8V6a2 2 0 012-2zm0 7a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/></svg>
                </span>
                <input
                  id="contrasena"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={contrasena}
                  onChange={e => setContrasena(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="field__toggle"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword
                    ? <svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.359 11.238a3 3 0 01-4.597-4.597m1.955-1.174A9.953 9.953 0 0110 5c4.418 0 8 3.582 8 5a9.956 9.956 0 01-2.071 2.929M4.929 4.929l10.142 10.142M2 10c0-1.418 3.582-5 8-5 .343 0 .681.021 1.013.06M15.071 15.071A9.956 9.956 0 0110 17c-4.418 0-8-3.582-8-5a9.956 9.956 0 012.929-3.929"/></svg>
                    : <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 3C5.582 3 2 6.582 2 10s3.582 7 8 7 8-3.582 8-7-3.582-7-8-7zm0 2a5 5 0 110 10A5 5 0 0110 5zm0 2a3 3 0 100 6 3 3 0 000-6z"/></svg>
                  }
                </button>
              </div>
            </div>

            {/* Recordar + Olvidé contraseña */}
            <div className="login-form__options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={recordar}
                  onChange={e => setRecordar(e.target.checked)}
                />
                <span className="checkbox-custom" aria-hidden="true"/>
                Recordar sesión
              </label>
              <a href="/recuperar-contrasena" className="forgot-link">
                ¿Olvidé mi contraseña?
              </a>
            </div>

            <button type="submit" className="btn-login">
              Ingresar
            </button>
          </form>

          <p className="login-card__note">
            Solo los administradores pueden crear nuevas cuentas.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;