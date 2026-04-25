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
 *  get:
 *    tags: [Users]
 *    summary: Get all users
 *    description: Returns a list of all registered users (Admin only)
 *    responses:
 *      200:
 *        description: List of users retrieved successfully
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden (insufficient permissions)
 */
router.get('/get-all-users', authenticateToken, requireRole(UserRole.EXECUTIVE), getUsers);


/**
 * @swagger
 * /users/create-new-user:
 *  post:
 *    tags: [Users]
 *    summary: Create a new user
 *    description: Creates a new user with a specific role (Admin only)
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *              - email
 *              - password
 *              - role
 *            properties:
 *              name:
 *                type: string
 *                example: Juan Pérez
 *              email:
 *                type: string
 *                example: juan@email.com
 *              password:
 *                type: string
 *                example: 123456
 *              role:
 *                type: string
 *                enum: [ADMIN, AGENT, EXECUTIVE]
 *    responses:
 *      201:
 *        description: User created successfully
 *      400:
 *        description: Validation error
 *      409:
 *        description: User already exists
 */
router.post('/create-new-user', authenticateToken, requireRole(UserRole.ADMIN), createUser);

/**
 * @swagger
 * /users/get-user/{id}:
 *  get:
 *    tags: [Users]
 *    summary: Get user by ID
 *    description: Returns a single user by their ID
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: MongoDB ObjectId of the user
 *    responses:
 *      200:
 *        description: User found
 *      400:
 *        description: Invalid ID format
 *      404:
 *        description: User not found
 */
router.get('/get-user/:id', authenticateToken, requireRole(UserRole.EXECUTIVE), getUserById);

/**
 * @swagger
 * /users/update-user/:{id}:
 *  put:
 *    tags: [Users]
 *    summary: Update user
 *    description: Updates user information (Admin only)
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: User ID
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
 *              role:
 *                type: string
 *                enum: [ADMIN, AGENT, EXECUTIVE]
 *    responses:
 *      200:
 *        description: User updated successfully
 *      400:
 *        description: Invalid data
 *      404:
 *        description: User not found
 */
router.put('/update-user/:id', authenticateToken, requireRole(UserRole.ADMIN), updateUser);

/**
 * @swagger
 * /users/delete-user/:{id}:
 *  delete:
 *    tags: [Users]
 *    summary: Delete or deactivate user
 *    description: Performs a soft delete by setting isActive to false (Admin only)
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: User ID
 *    responses:
 *      200:
 *        description: User deactivated successfully
 *      404:
 *        description: User not found
 */
router.delete('/delete-user/:id', authenticateToken, requireRole(UserRole.ADMIN), deleteUser);

export default router;