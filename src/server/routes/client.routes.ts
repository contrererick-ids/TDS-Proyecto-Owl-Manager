import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware'
import { UserRole } from '../models/user.model'
import { createClient, getClients, getClientById, updateClient, deleteClient, assignClientToUser } from '../controllers/client.controller';

const router = Router();

// Rutas CRUD para clientes

/**
 * @swagger
 * tags:
 *  - name: Clients
 *    description: Client management and portfolio control
 */

/**
 * @swagger
 * /clients/get-all-clients:
 *  get:
 *    tags: [Clients]
 *    summary: Get all clients
 *    description: Returns a list of all registered clients (Executive role required)
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: List of clients retrieved successfully
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden (insufficient permissions)
 */
router.get('/get-all-clients', authenticateToken, requireRole(UserRole.AGENT), getClients);

/**
 * @swagger
 * /clients/new-client:
 *  post:
 *    tags: [Clients]
 *    summary: Create a new client
 *    description: Registers a new client in the system (Executive role required)
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *              - email
 *              - phone
 *            properties:
 *              name:
 *                type: string
 *                example: Empresa ABC
 *              email:
 *                type: string
 *                example: contacto@empresa.com
 *              phone:
 *                type: string
 *                example: "3312345678"
 *              address:
 *                type: string
 *                example: Guadalajara, Jalisco
 *              assignedExecutive:
 *                type: string
 *                description: User ID of assigned executive
 *    responses:
 *      201:
 *        description: Client created successfully
 *      400:
 *        description: Validation error
 */
router.post('/new-client', authenticateToken, requireRole(UserRole.EXECUTIVE), createClient);

/**
 * @swagger
 * /clients/get-client/:{id}:
 *  get:
 *    tags: [Clients]
 *    summary: Get client by ID
 *    description: Returns a single client by their ID
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: MongoDB ObjectId of the client
 *    responses:
 *      200:
 *        description: Client found
 *      400:
 *        description: Invalid ID format
 *      404:
 *        description: Client not found
 */
router.get('/get-client/:id', authenticateToken, requireRole(UserRole.AGENT), getClientById);

/**
 * @swagger
 * /clients/update-client/:{id}:
 *  put:
 *    tags: [Clients]
 *    summary: Update client
 *    description: Updates client information (Executive role required)
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Client ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              email:
 *                type: string
 *              phone:
 *                type: string
 *              address:
 *                type: string
 *              assignedExecutive:
 *                type: string
 *    responses:
 *      200:
 *        description: Client updated successfully
 *      400:
 *        description: Invalid data
 *      404:
 *        description: Client not found
 */
router.put('/update-client/:id', authenticateToken, requireRole(UserRole.EXECUTIVE), updateClient);

/**
 * @swagger
 * /clients/delete-client/:{id}:
 *  delete:
 *    tags: [Clients]
 *    summary: Delete or deactivate client
 *    description: Performs a soft delete by setting isActive to false
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Client ID
 *    responses:
 *      200:
 *        description: Client deactivated successfully
 *      404:
 *        description: Client not found
 */
router.delete('/delete-client/:id', authenticateToken, requireRole(UserRole.EXECUTIVE), deleteClient);

/**
 * @swagger
 * /clients/assign-client/:{id}:
 *  patch:
 *    tags: [Clients]
 *    summary: Assign or reassign executive
 *    description: Assigns or reassigns an executive to a client
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Client ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - executiveId
 *            properties:
 *              executiveId:
 *                type: string
 *                example: 661a9c123abc456def789000
 *    responses:
 *      200:
 *        description: Executive assigned successfully
 *      404:
 *        description: Client or executive not found
 */
router.patch('/assign-client/:id', authenticateToken, requireRole(UserRole.EXECUTIVE), assignClientToUser);

export default router;