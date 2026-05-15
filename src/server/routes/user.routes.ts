import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware'
import { UserRole } from '../models/user.model'
import { createUser, getUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller';

const router = Router();

// Rutas CRUD para usuarios

/**
 * @swagger
 * tags:
 *  - name: Users
 *    description: User management (Admin only)
 */

/**
 * @swagger
 * /users/get-all-users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     description: Returns all registered users. Accessible by EXECUTIVE and ADMIN roles.
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden
 *
 *       500:
 *         description: Internal server error
 */
router.get('/get-all-users', authenticateToken, requireRole(UserRole.AGENT), getUsers);



/**
 * @swagger
 * /users/create-new-user:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     description: |
 *       Creates a new system user.
 *       Only administrators can create users.
 *       A welcome email is automatically sent after successful creation.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       409:
 *         description: Username or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/create-new-user', authenticateToken, requireRole(UserRole.ADMIN), createUser);

/**
 * @swagger
 * /users/get-user/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
 *
 *     security:
 *       - bearerAuth: []
 *
 *     description: Returns a specific user by MongoDB ID.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden
 *
 *       404:
 *         description: User not found
 *
 *       500:
 *         description: Internal server error
 */
router.get('/get-user/:id', authenticateToken, requireRole(UserRole.EXECUTIVE), getUserById);


/**
 * @swagger
 * /users/update-user/{id}:
 *   put:
 *     summary: Update user information
 *     tags: [Users]
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
 *         description: User ID
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden
 *
 *       404:
 *         description: User not found
 *
 *       500:
 *         description: Internal server error
 */
router.put('/update-user/:id', authenticateToken, requireRole(UserRole.ADMIN), updateUser);


/**
 * @swagger
 * /users/delete-user/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     description: |
 *       Deletes a user permanently.
 *       Users with assigned tickets cannot be deleted.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *
 *     responses:
 *       200:
 *         description: User deleted successfully
 *
 *       400:
 *         description: User has assigned tickets
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden
 *
 *       404:
 *         description: User not found
 *
 *       500:
 *         description: Internal server error
 */
router.delete('/delete-user/:id', authenticateToken, requireRole(UserRole.ADMIN), deleteUser);

export default router;
