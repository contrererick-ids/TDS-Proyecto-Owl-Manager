// =====================================================
// types/models.ts — Owl Manager
// Tipos del frontend alineados con los modelos Mongoose
// =====================================================

export enum UserRole {
  ADMIN     = 'ADMIN',
  EXECUTIVE = 'EXECUTIVE',
  AGENT     = 'AGENT',
}

export enum TicketStatus {
  PENDING     = 'PENDING',
  IN_PROGRESS = 'IN_PROCESS',
  CLOSED      = 'CLOSED',
  CANCELED    = 'CANCELED',
}

export interface IUser {
  _id: string;
  username: string;
  name: string;
  email?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IClient {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  assignedTo: string | IUser;   // poblado o solo ID según el endpoint
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IComment {
  _id?: string;
  commentAuthorId: string | IUser;
  text: string;
  createdAt: string;
}

export interface ITicket {
  _id: string;
  ticketId: string;
  requestName: string;
  clientId: string | IClient;
  comments: IComment[];
  assignedTo?: string | IUser;
  createdBy: string | IUser;
  lastModifiedDate: string;
  status: TicketStatus;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISale {
  _id: string;
  clientId: string | IClient;
  registeredBy: string | IUser;
  amount: number;
  description?: string;
  saleDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IDocument {
  _id: string;
  entityType: string;
  entityId: string;
  uploadedBy: string | IUser;
  fileName: string;
  fileUrl: string;
  mimeType?: string;
  createdAt: string;
  updatedAt: string;
}

export const TICKET_STATUS_LABEL: Record<TicketStatus, string> = {
  [TicketStatus.PENDING]:     'Pendiente',
  [TicketStatus.IN_PROGRESS]: 'En proceso',
  [TicketStatus.CLOSED]:      'Cerrado',
  [TicketStatus.CANCELED]:    'Cancelado',
};

export const TICKET_STATUS_COLOR: Record<TicketStatus, string> = {
  [TicketStatus.PENDING]:     '#E8A838',   // ámbar
  [TicketStatus.IN_PROGRESS]: '#60a5fa',   // azul
  [TicketStatus.CLOSED]:      '#4ade80',   // verde
  [TicketStatus.CANCELED]:    '#f87171',   // rojo
};

export const USER_ROLE_LABEL: Record<UserRole, string> = {
  [UserRole.ADMIN]:     'Administrador',
  [UserRole.EXECUTIVE]: 'Ejecutivo',
  [UserRole.AGENT]:     'Agente',
};
