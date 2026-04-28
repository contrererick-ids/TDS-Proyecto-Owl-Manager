import { Router } from "express";
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware'
import { UserRole} from '../models/user.model'
import { createTicket, getTickets, getTicketByTicketId, reassignTicket, updateStatus, deleteTicket, addComment, getMyTickets } from "../controllers/ticket.controller";

const router = Router();

// Rutas CRUD para tickets

/**
 * @swagger
 * tags:
 *  - name: Tickets
 *    description: Ticket management, status tracking, and workflow control
 */

/**
 * @swagger
 * /tickets/get-all-tickets:
 *  get:
 *    tags: [Tickets]
 *    summary: Get all tickets
 *    description: Returns all tickets. Results may vary depending on user role (Agent, Executive)
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: List of tickets retrieved successfully
 *      401:
 *        description: Unauthorized
 */
router.get("/get-all-tickets", authenticateToken, requireRole(UserRole.AGENT), getTickets);

/**
 * @swagger
 * /tickets/new-ticket:
 *  post:
 *    tags: [Tickets]
 *    summary: Create a new ticket
 *    description: Creates a ticket associated with a client (required)
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - clientId
 *              - title
 *              - description
 *            properties:
 *              clientId:
 *                type: string
 *                example: 661a9c123abc456def789000
 *              title:
 *                type: string
 *                example: Problema con servicio
 *              description:
 *                type: string
 *                example: El cliente reporta una falla en el sistema
 *              status:
 *                type: string
 *                enum: [PENDING, IN_PROGRESS, CLOSED, CANCELED]
 *    responses:
 *      201:
 *        description: Ticket created successfully
 *      400:
 *        description: Validation error
 */
router.post("/new-ticket", authenticateToken, requireRole(UserRole.EXECUTIVE), createTicket);

/**
 * @swagger
 * /tickets/get-ticket/:{id}:
 *  get:
 *    tags: [Tickets]
 *    summary: Get ticket by ID
 *    description: Returns detailed information of a specific ticket
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Ticket ID
 *    responses:
 *      200:
 *        description: Ticket found
 *      404:
 *        description: Ticket not found
 */
router.get("/get-ticket/:ticketId", authenticateToken, requireRole(UserRole.AGENT), getTicketByTicketId);

router.get("/get-my-tickets/:userId", authenticateToken, requireRole(UserRole.AGENT), getMyTickets);

/**
 * @swagger
 * /tickets/delete-ticket/:{id}:
 *  delete:
 *    tags: [Tickets]
 *    summary: Delete or deactivate ticket
 *    description: Performs a soft delete by setting isActive to false instead of removing the ticket permanently
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Ticket ID
 *    responses:
 *      200:
 *        description: Ticket deactivated successfully
 *      404:
 *        description: Ticket not found
 */
router.delete("/delete-ticket/:ticketId", authenticateToken, requireRole(UserRole.ADMIN), deleteTicket);

/**
 * @swagger
 * /tickets/reassign-ticket/:{id}:
 *  patch:
 *    tags: [Tickets]
 *    summary: Reassign ticket
 *    description: Assigns or reassigns a ticket to another agent
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - agentId
 *            properties:
 *              agentId:
 *                type: string
 *                example: 661a9c123abc456def789000
 *    responses:
 *      200:
 *        description: Ticket reassigned successfully
 *      404:
 *        description: Ticket or agent not found
 */
router.patch("/reassign-ticket/:ticketId", authenticateToken, requireRole(UserRole.AGENT), reassignTicket);

/**
 * @swagger
 * /tickets/update-status/:{id}:
 *  patch:
 *    tags: [Tickets]
 *    summary: Change ticket status
 *    description: Updates the status of a ticket (Pending, In Progress, Closed, Canceled)
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - status
 *            properties:
 *              status:
 *                type: string
 *                enum: [PENDING, IN_PROGRESS, CLOSED, CANCELED]
 *    responses:
 *      200:
 *        description: Status updated successfully
 *      400:
 *        description: Invalid status
 */
router.patch("/update-status/:ticketId", authenticateToken, requireRole(UserRole.AGENT), updateStatus);

/**
 * @swagger
 * /tickets/add-comment/:{id}:
 *  post:
 *    tags: [Tickets]
 *    summary: Add comment to ticket
 *    description: Adds a comment for internal tracking
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - comment
 *            properties:
 *              comment:
 *                type: string
 *                example: Se contactó al cliente y está en revisión
 *    responses:
 *      201:
 *        description: Comment added successfully
 */
router.post("/add-comment/:ticketId", authenticateToken, requireRole(UserRole.AGENT), addComment);

export default router;