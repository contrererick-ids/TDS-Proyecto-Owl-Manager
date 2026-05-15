import { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNotifications } from '../../context/NotificationsContext';
import '../../../public/styles/notificationBell.css';

const IconBell = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
       width="20" height="20">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

function formatTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1)  return 'Ahora';
  if (diffMin < 60) return `Hace ${diffMin} min`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24)  return `Hace ${diffHr} h`;
  return date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
}

interface NotificationBellProps {
  collapsed: boolean;
}

export default function NotificationBell({ collapsed }: NotificationBellProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const [open, setOpen] = useState(false);
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef  = useRef<HTMLDivElement>(null);

  // Cada vez que se abre el panel, calculamos la posición del botón
  // y posicionamos el panel con coordenadas fijas relativas al viewport.
  useEffect(() => {
    if (!open || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();

    if (collapsed) {
      // Sidebar colapsado: panel aparece a la derecha del botón
      setPanelStyle({
        position: 'fixed',
        top:  rect.top,
        left: rect.right + 12,
      });
    } else {
      // Sidebar expandido: panel aparece encima del botón, alineado a la izquierda
      setPanelStyle({
        position: 'fixed',
        bottom: window.innerHeight - rect.top + 10,
        left:   rect.left,
      });
    }
  }, [open, collapsed]);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        panelRef.current  && !panelRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const panel = open ? ReactDOM.createPortal(
    <div ref={panelRef} className="notif-bell__panel" style={panelStyle}>

      {/* Header */}
      <div className="notif-bell__header">
        <span className="notif-bell__title">Notificaciones</span>
        <div className="notif-bell__actions">
          {unreadCount > 0 && (
            <button className="notif-bell__action-btn" onClick={markAllAsRead}>
              Marcar leídas
            </button>
          )}
          {notifications.length > 0 && (
            <button
              className="notif-bell__action-btn notif-bell__action-btn--danger"
              onClick={clearAll}
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Lista */}
      <ul className="notif-bell__list">
        {notifications.length === 0 ? (
          <li className="notif-bell__empty"><span>Sin notificaciones</span></li>
        ) : (
          notifications.map(n => (
            <li
              key={n.id}
              className={`notif-bell__item ${!n.read ? 'notif-bell__item--unread' : ''}`}
              onClick={() => markAsRead(n.id)}
            >
              <div className="notif-bell__item-top">
                <span className="notif-bell__ticket-id">{n.ticketId}</span>
                <span className="notif-bell__time">{formatTime(n.receivedAt)}</span>
              </div>
              <p className="notif-bell__item-name">{n.requestName}</p>
              <p className="notif-bell__item-msg">{n.message}</p>
            </li>
          ))
        )}
      </ul>
    </div>,
    document.body
  ) : null;

  return (
    <div className="notif-bell">
      <button
        ref={buttonRef}
        className="notif-bell__btn"
        onClick={() => setOpen(v => !v)}
        title="Notificaciones"
        aria-label={`Notificaciones${unreadCount > 0 ? `, ${unreadCount} sin leer` : ''}`}
      >
        <IconBell />
        {unreadCount > 0 && (
          <span className="notif-bell__badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {panel}
    </div>
  );
}