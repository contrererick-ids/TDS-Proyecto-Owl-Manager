import { Router } from "express";
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware'
import { UserRole} from '../models/user.model'
import { createTicket, getTickets, getTicketByTicketId, reassignTicket, updateStatus, updateTicket, deleteTicket, addComment, getMyTickets } from "../controllers/ticket.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Tickets
 *     description: Ticket management, status tracking and workflow control
 */


/**
 * @swagger
 * /tickets/get-all-tickets:
 *   get:
 *     tags: [Tickets]
 *     summary: Get all tickets
 *     description: Returns tickets with optional filters
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *
 *       - in: query
 *         name: assignedTo
 *         schema:
 *           type: string
 *
 *       - in: query
 *         name: unassigned
 *         schema:
 *           type: boolean
 *
 *       - in: query
 *         name: mine
 *         schema:
 *           type: boolean
 *
 *     responses:
 *       200:
 *         description: Tickets retrieved successfully
 *
 *       500:
 *         description: Internal server error
 */
router.get("/get-all-tickets", authenticateToken, requireRole(UserRole.AGENT), getTickets);


/**
 * @swagger
 * /tickets/new-ticket:
 *   post:
 *     tags: [Tickets]
 *     summary: Create ticket
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - requestName
 *               - clientId
 *               - createdBy
 *
 *             properties:
 *               requestName:
 *                 type: string
 *                 example: Service request
 *
 *               clientId:
 *                 type: string
 *                 example: 661a9c123abc456def789000
 *
 *               assignedTo:
 *                 type: string
 *                 example: Juan Perez
 *
 *               createdBy:
 *                 type: object
 *
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *
 *       404:
 *         description: Client or user not found
 *
 *       500:
 *         description: Internal server error
 */
router.post("/new-ticket", authenticateToken, requireRole(UserRole.EXECUTIVE), createTicket);


/**
 * @swagger
 * /tickets/get-ticket/{ticketId}:
 *   get:
 *     tags: [Tickets]
 *     summary: Get ticket by ticket ID
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Ticket found
 *
 *       404:
 *         description: Ticket not found
 */
router.get("/get-ticket/:ticketId", authenticateToken, requireRole(UserRole.AGENT), getTicketByTicketId);


/**
 * @swagger
 * /tickets/get-my-tickets/{userId}:
 *   get:
 *     tags: [Tickets]
 *     summary: Get tickets assigned to a user
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Tickets retrieved successfully
 *
 *       404:
 *         description: User not found
 */
router.get("/get-my-tickets/:userId", authenticateToken, requireRole(UserRole.AGENT), getMyTickets);


/**
 * @swagger
 * /tickets/delete-ticket/{ticketId}:
 *   delete:
 *     tags: [Tickets]
 *     summary: Delete ticket
 *
 *     security:
 *       - bearerAuth: []
 *
 *     description: Permanently deletes a ticket
 *
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Ticket deleted successfully
 *
 *       404:
 *         description: Ticket not found
 */
router.delete("/delete-ticket/:ticketId", authenticateToken, requireRole(UserRole.ADMIN), deleteTicket);


/**
 * @swagger
 * /tickets/reassign-ticket/{ticketId}:
 *   patch:
 *     tags: [Tickets]
 *     summary: Reassign ticket
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - assignedTo
 *
 *             properties:
 *               assignedTo:
 *                 type: string
 *                 example: Juan Perez
 *
 *     responses:
 *       200:
 *         description: Ticket reassigned successfully
 *
 *       404:
 *         description: Ticket or user not found
 */
router.patch("/reassign-ticket/:ticketId", authenticateToken, requireRole(UserRole.AGENT), reassignTicket);


/**
 * @swagger
 * /tickets/update-status/{ticketId}:
 *   patch:
 *     tags: [Tickets]
 *     summary: Update ticket status
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             required:
 *               - status
 *
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROCESS, CLOSED, CANCELED]
 *
 *               reason:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: Status updated successfully
 *
 *       400:
 *         description: Cancel reason required
 *
 *       404:
 *         description: Ticket not found
 */
router.patch("/update-status/:ticketId", authenticateToken, requireRole(UserRole.AGENT), updateStatus);


/**
 * @swagger
 * /tickets/add-comment/{ticketId}:
 *   post:
 *     tags: [Tickets]
 *     summary: Add comment
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             required:
 *               - authorName
 *               - text
 *
 *             properties:
 *
 *               authorName:
 *                 type: string
 *                 example: Juan Perez
 *
 *               text:
 *                 type: string
 *                 example: Client contacted successfully
 *
 *     responses:
 *       200:
 *         description: Comment added successfully
 *
 *       404:
 *         description: User or ticket not found
 */
router.post("/add-comment/:ticketId", authenticateToken, requireRole(UserRole.AGENT), addComment);


/**
 * @swagger
 * /tickets/update-ticket/{id}:
 *   put:
 *     tags: [Tickets]
 *     summary: Update ticket
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *
 *     responses:
 *       200:
 *         description: Ticket updated successfully
 *
 *       404:
 *         description: Ticket not found
 */
router.put("/update-ticket/:id", authenticateToken, requireRole(UserRole.AGENT), updateTicket);

export default router;