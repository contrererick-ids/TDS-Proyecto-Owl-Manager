import { Router } from "express";
import { createTicket, getTickets, getTicketByTicketId, reassignTicket, updateStatus, deleteTicket, addComment } from "../controllers/ticket.controller";

const router = Router();

// Rutas CRUD para tickets
router.post("/new-ticket", createTicket);
router.get("/get-all-tickets", getTickets);
router.get("/get-ticket/:ticketId", getTicketByTicketId);
router.delete("/delete-ticket/:ticketId", deleteTicket);
router.patch("/reassign-ticket/:ticketId", reassignTicket);
router.patch("/update-status/:ticketId", updateStatus);
router.post("/add-comment/:ticketId", addComment);

export default router;