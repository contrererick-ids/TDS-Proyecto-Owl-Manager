import app from '../app';
import { TicketController } from "../controllers/ticket.controller";

const ticketController = new TicketController();

// Crear ticket
app.post("/tickets", ticketController.createTicket);

// Listar tickets
app.get("/tickets", ticketController.getTickets);

// Obtener ticket por ID
app.get("/tickets/:id", ticketController.getTicketById);

// Actualizar ticket
app.put("/tickets/:id", ticketController.updateTicket);

// Cancelar ticket
app.delete("/tickets/:id", ticketController.cancelTicket);

// Reasignar ticket
app.patch("/tickets/:id/assign", ticketController.assignTicket);

// Cambiar estatus
app.patch("/tickets/:id/status", ticketController.changeStatus);

// Tickets asignados al usuario
app.get("/tickets/assigned", ticketController.getAssignedTickets);

// Tickets pendientes (ejecutivo)
app.get("/tickets/pending", ticketController.getPendingTickets);

// Comentarios
app.post("/tickets/:id/comments", ticketController.addComment);
app.get("/tickets/:id/comments", ticketController.getComments);

export default app;