import { Router } from "express";
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware'
import { UserRole } from '../models/user.model'
import { createSale, getSales, getSaleById, updateSale, deleteSale, getSalesByClient } from "../controllers/sale.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *  - name: Sales
 *    description: Sales management and client transaction tracking
 */


/**
 * @swagger
 * /sales/create-new-sale:
 *  post:
 *    tags: [Sales]
 *    summary: Create a new sale
 *    description: Registers a new sale associated with a client (Executive role required)
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
 *              - amount
 *            properties:
 *              clientId:
 *                type: string
 *                example: 661a9c123abc456def789000
 *              amount:
 *                type: number
 *                example: 1500
 *              description:
 *                type: string
 *                example: Venta de servicio premium
 *    responses:
 *      201:
 *        description: Sale created successfully
 *      400:
 *        description: Validation error
 *      401:
 *        description: Unauthorized
 */
router.post("/create-new-sale", authenticateToken, requireRole(UserRole.EXECUTIVE), createSale);

/**
 * @swagger
 * /sales/get-all-sale:
 *  get:
 *    tags: [Sales]
 *    summary: Get all sales
 *    description: Returns a list of all sales (Agent role required)
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: List of sales retrieved successfully
 *      401:
 *        description: Unauthorized
 */
router.get("/get-all-sale", authenticateToken, requireRole(UserRole.AGENT), getSales);

/**
 * @swagger
 * /sales/client/:{id}:
 *  get:
 *    tags: [Sales]
 *    summary: Get sales by client
 *    description: Returns all sales associated with a specific client
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: clientId
 *        required: true
 *        schema:
 *          type: string
 *        description: Client ID
 *    responses:
 *      200:
 *        description: Sales retrieved successfully
 *      404:
 *        description: Client not found
 */
router.get("/client/:clientId", authenticateToken, requireRole(UserRole.AGENT), getSalesByClient);

/**
 * @swagger
 * /sales/get-sale/:{id}:
 *  get:
 *    tags: [Sales]
 *    summary: Get sale by ID
 *    description: Returns details of a specific sale
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Sale ID
 *    responses:
 *      200:
 *        description: Sale found
 *      404:
 *        description: Sale not found
 */
router.get("/get-sale/:id", authenticateToken, requireRole(UserRole.AGENT), getSaleById);

/**
 * @swagger
 * /sales/update-sale/:{id}:
 *  put:
 *    tags: [Sales]
 *    summary: Update sale
 *    description: Updates sale information (Executive role required)
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Sale ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              amount:
 *                type: number
 *                example: 2000
 *              description:
 *                type: string
 *                example: Actualización de venta
 *    responses:
 *      200:
 *        description: Sale updated successfully
 *      404:
 *        description: Sale not found
 */
router.put("/update-sale/:id", authenticateToken, requireRole(UserRole.EXECUTIVE), updateSale);

/**
 * @swagger
 * /sales/delete-sale/:{id}:
 *  delete:
 *    tags: [Sales]
 *    summary: Delete or deactivate sale
 *    description: Performs a soft delete by setting isActive to false
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Sale ID
 *    responses:
 *      200:
 *        description: Sale deleted successfully
 *      404:
 *        description: Sale not found
 */
router.delete("/delete-sale/:id", authenticateToken, requireRole(UserRole.EXECUTIVE), deleteSale);

export default router;

