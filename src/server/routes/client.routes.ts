import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware'
import { UserRole } from '../models/user.model'
import { createClient, getClients, getClientById, getClientByName, updateClient, deleteClient, assignClientToUser, toggleClientStatus } from '../controllers/client.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Clients
 *     description: Client management and portfolio control
 */


/**
 * @swagger
 * /clients/get-all-clients:
 *   get:
 *     tags: [Clients]
 *     summary: Get all clients
 *     description: Returns all registered clients
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Clients retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/get-all-clients', authenticateToken, requireRole(UserRole.AGENT), getClients);


/**
 * @swagger
 * /clients/new-client:
 *   post:
 *     tags: [Clients]
 *     summary: Create new client
 *     description: Creates a client and optionally associates uploaded documents
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - company
 *               - assignedTo
 *             properties:
 *               name:
 *                 type: string
 *                 example: Empresa ABC
 *               email:
 *                 type: string
 *                 example: contacto@empresa.com
 *               phone:
 *                 type: string
 *                 example: "3312345678"
 *               company:
 *                 type: string
 *                 example: Tech Solutions
 *               assignedTo:
 *                 type: string
 *                 example: Juan Perez
 *               documents:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     fileName:
 *                       type: string
 *                       example: contrato.pdf
 *                     mimeType:
 *                       type: string
 *                       example: application/pdf
 *     responses:
 *       201:
 *         description: Client created successfully
 *       400:
 *         description: Missing fields or invalid format
 *       404:
 *         description: Assigned user not found
 *       500:
 *         description: Internal server error
 */
router.post('/new-client', authenticateToken, requireRole(UserRole.EXECUTIVE), createClient);


/**
 * @swagger
 * /clients/get-client/{id}:
 *   get:
 *     tags: [Clients]
 *     summary: Get client by ID
 *     description: Returns a client by MongoDB ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the client
 *     responses:
 *       200:
 *         description: Client found
 *       404:
 *         description: Client not found
 *       500:
 *         description: Internal server error
 */
router.get('/get-client-by-id/:id', authenticateToken, requireRole(UserRole.AGENT), getClientById);


/**
 * @swagger
 * /clients/get-client-by-name:
 *   get:
 *     tags: [Clients]
 *     summary: Get client by name
 *     description: Searches a client by name. This endpoint uses request body in GET.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Empresa ABC
 *     responses:
 *       200:
 *         description: Client found
 *       400:
 *         description: Invalid name format
 *       404:
 *         description: Client not found
 *       500:
 *         description: Internal server error
 */
router.get('/get-client-by-name', authenticateToken, requireRole(UserRole.AGENT), getClientByName);


/**
 * @swagger
 * /clients/update-client/{id}:
 *   put:
 *     tags: [Clients]
 *     summary: Update client
 *     description: Updates client information
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Client ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               company:
 *                 type: string
 *               assignedTo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Client updated successfully
 *       404:
 *         description: Client not found
 *       500:
 *         description: Internal server error
 */
router.put('/update-client/:id', authenticateToken, requireRole(UserRole.EXECUTIVE), updateClient);


/**
 * @swagger
 * /clients/delete-client/{id}:
 *   delete:
 *     tags: [Clients]
 *     summary: Delete client
 *     description: Permanently deletes a client
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Client ID
 *     responses:
 *       200:
 *         description: Client deleted successfully
 *       404:
 *         description: Client not found
 *       500:
 *         description: Internal server error
 */
router.delete('/delete-client/:id', authenticateToken, requireRole(UserRole.EXECUTIVE), deleteClient);


/**
 * @swagger
 * /clients/assign-client/{id}:
 *   patch:
 *     tags: [Clients]
 *     summary: Assign client to user
 *     description: Assigns or reassigns a client to a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Client ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - assignedTo
 *             properties:
 *               assignedTo:
 *                 type: string
 *                 example: Juan Perez
 *     responses:
 *       200:
 *         description: Client assigned successfully
 *       400:
 *         description: assignedTo required
 *       404:
 *         description: User or client not found
 *       500:
 *         description: Internal server error
 */
router.patch('/assign-client/:id', authenticateToken, requireRole(UserRole.EXECUTIVE), assignClientToUser);


/**
 * @swagger
 * /clients/toggle-client-status/{id}:
 *   patch:
 *     tags: [Clients]
 *     summary: Toggle client status
 *     description: Activates or deactivates a client by changing the isActive status
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
 *         description: Client ID
 *
 *     responses:
 *
 *       200:
 *         description: Client status updated successfully
 *
 *       404:
 *         description: Client not found
 *
 *       500:
 *         description: Internal server error
 */
router.patch('/toggle-client-status/:id', authenticateToken, requireRole(UserRole.EXECUTIVE), toggleClientStatus);

export default router;