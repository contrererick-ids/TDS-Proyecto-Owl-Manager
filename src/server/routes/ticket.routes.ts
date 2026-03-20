import app from '../app';
import { TicketController } from "../controllers/ticket.controller";

const ticketController = new TicketController();

// Crear ticket
app.post("/", ticketController.createTicket);

// Listar tickets
app.get("/", ticketController.getTickets);

// Obtener ticket por ID
app.get("/:id", ticketController.getTicketById);

// Actualizar ticket
app.put("/:id", ticketController.updateTicket);

// Cancelar ticket
app.delete("/:id", ticketController.cancelTicket);

// Reasignar ticket
app.patch("/:id/assign", ticketController.assignTicket);

// Cambiar estatus
app.patch("/:id/status", ticketController.changeStatus);

// Tickets asignados al usuario
app.get("/assigned", ticketController.getAssignedTickets);

// Tickets pendientes (ejecutivo)
app.get("/pending", ticketController.getPendingTickets);

// Comentarios
app.post("/:id/comments", ticketController.addComment);
app.get("/:id/comments", ticketController.getComments);

export default app;