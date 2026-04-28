import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { api } from '../../services/api';
import '../../public/styles/dashboard.css'

interface User {
  _id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  isActive: boolean;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function getUserData() {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
          console.log("No active session. Redirecting to Log In.");
          navigate('/auth/login');
          return;
        }

        const res = await api.get(`/auth/profile/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data); // <- aquí guardas el objeto en el estado
        } else {
          const { message } = await res.json();
          console.error('Error: ', message);
          navigate('/auth/login');
        }
      } catch (error) {
        console.log("Error: ", error, ". Something went wrong fetching user's data.");
      }
    }

    getUserData();
  }, []); // solo se ejecuta una vez al montar el componente

  return (
    <div className="dashboard-root">

      {/* ── Sidebar ───────────────────────── */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-profile">
          <div className="sidebar-profile-picture">
          </div>
          <div className="sidebar-profile-name">
            <h3 className="sidebar-user-name">{user?.name}</h3>
          </div>
        </div>

        <nav className="dashboard-nav">
          <a href="#" className="active">Dashboard</a>
          <a href="#">Usuarios</a>
          <a href="#">Reportes</a>
          <a href="#">Configuración</a>
        </nav>
      </aside>

      {/* ── Main ─────────────────────────── */}
      <main className="dashboard-main">

        {/* Header */}
        <header className="dashboard-header">
          <h2>Bienvenido de vuelta, {user?.name}</h2>
          <div className="dashboard-user">
            <span>{user?.name }</span>
          </div>
        </header>

        {/* Cards */}
        <section className="dashboard-cards">
          <div className="card">
            <h3>Usuarios</h3>
            <p>1,245</p>
          </div>

          <div className="card">
            <h3>Ingresos</h3>
            <p>$12,340</p>
          </div>

          <div className="card">
            <h3>Ventas</h3>
            <p>320</p>
          </div>

          <div className="card">
            <h3>Errores</h3>
            <p>3</p>
          </div>
        </section>

        {/* Contenido */}
        <section className="dashboard-content">
          <h3>Actividad reciente</h3>
          <p>Aquí puedes agregar tablas, gráficos o lo que necesites.</p>
        </section>

      </main>
    </div>
  )
}