import { Router } from "express";
import * as ticketController from "../controllers/ticket.controller";

const router = Router();

// Crear ticket
router.post("/tickets", ticketController.createTicket);

// Listar tickets
router.get("/tickets", ticketController.getTickets);

// Obtener ticket por ID
router.get("/tickets/:id", ticketController.getTicketById);

// Actualizar ticket
router.put("/tickets/:id", ticketController.updateTicket);

// Cancelar ticket
router.delete("/tickets/:id", ticketController.cancelTicket);

// Reasignar ticket
router.patch("/tickets/:id/assign", ticketController.assignTicket);

// Cambiar estatus
router.patch("/tickets/:id/status", ticketController.changeStatus);

// Tickets asignados al usuario
router.get("/tickets/assigned", ticketController.getAssignedTickets);

// Tickets pendientes (ejecutivo)
router.get("/tickets/pending", ticketController.getPendingTickets);

// Comentarios
router.post("/tickets/:id/comments", ticketController.addComment);
router.get("/tickets/:id/comments", ticketController.getComments);

export default router;