import { Router } from "express";
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware'
import { UserRole} from '../models/user.model'
import { createTicket, getTickets, getTicketByTicketId, reassignTicket, updateStatus, deleteTicket, addComment } from "../controllers/ticket.controller";

const router = Router();

// Rutas CRUD para tickets
router.post("/new-ticket", authenticateToken, requireRole(UserRole.EXECUTIVE), createTicket);
router.get("/get-all-tickets", authenticateToken, requireRole(UserRole.AGENT), getTickets);
router.get("/get-ticket/:ticketId", authenticateToken, requireRole(UserRole.AGENT), getTicketByTicketId);
router.delete("/delete-ticket/:ticketId", authenticateToken, requireRole(UserRole.ADMIN), deleteTicket);
router.patch("/reassign-ticket/:ticketId", authenticateToken, requireRole(UserRole.AGENT), reassignTicket);
router.patch("/update-status/:ticketId", authenticateToken, requireRole(UserRole.AGENT), updateStatus);
router.post("/add-comment/:ticketId", authenticateToken, requireRole(UserRole.AGENT), addComment);

export default router;