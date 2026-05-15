import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSocket } from './SocketContext';
import toast from 'react-hot-toast';

export interface Notification {
  id: string;          // generado en el cliente con crypto.randomUUID()
  ticketId: string;    // e.g. "TCK-007"
  requestName: string; // nombre del ticket
  message: string;     // mensaje del servidor
  read: boolean;
  receivedAt: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAllAsRead: () => {},
  markAsRead: () => {},
  clearAll: () => {},
});

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!socket) return;

    // Payload que emite el backend en reassignTicket:
    // { ticketId, requestName, message }
    const handleTicketAsignado = (data: {
      ticketId: string;
      requestName: string;
      message: string;
    }) => {
      const newNotification: Notification = {
        id: crypto.randomUUID(),
        ticketId: data.ticketId,
        requestName: data.requestName,
        message: data.message,
        read: false,
        receivedAt: new Date(),
      };

      setNotifications(prev => [newNotification, ...prev]);

      // Toast inmediato para llamar la atención aunque el panel esté cerrado
      toast.success(`🎫 Nuevo ticket asignado: ${data.ticketId}`, {
        duration: 5000,
      });
    };

    socket.on('ticket-asignado', handleTicketAsignado);

    // Cleanup: quitar listener al desmontar o al cambiar socket
    return () => {
      socket.off('ticket-asignado', handleTicketAsignado);
    };
  }, [socket]);

  const unreadCount = notifications.filter(n => !n.read).length;

  function markAsRead(id: string) {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }

  function markAllAsRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  function clearAll() {
    setNotifications([]);
  }

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAllAsRead, markAsRead, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextType {
  return useContext(NotificationContext);
}