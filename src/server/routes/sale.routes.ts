import { Router } from "express";
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware'
import { UserRole } from '../models/user.model'
import { createSale, getSales, getSaleById, updateSale, deleteSale, getSalesByClient } from "../controllers/sale.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Sales
 *     description: Sales management and client transaction tracking
 */


/**
 * @swagger
 * /sales/create-new-sale:
 *   post:
 *     tags: [Sales]
 *     summary: Create new sale
 *     description: Registers a sale associated with a client
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
 *               - clientId
 *               - amount
 *
 *             properties:
 *
 *               clientId:
 *                 type: string
 *                 example: 661a9c123abc456def789000
 *
 *               amount:
 *                 type: number
 *                 example: 1500
 *
 *               description:
 *                 type: string
 *                 example: Premium service sale
 *
 *               saleDate:
 *                 type: string
 *                 format: date-time
 *
 *     responses:
 *
 *       201:
 *         description: Sale created successfully
 *
 *       400:
 *         description: Missing or invalid fields
 *
 *       404:
 *         description: Client not found
 *
 *       500:
 *         description: Internal server error
 */
router.post("/create-new-sale", authenticateToken, requireRole(UserRole.AGENT), createSale);



/**
 * @swagger
 * /sales/get-all-sale:
 *   get:
 *     tags: [Sales]
 *     summary: Get all sales
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *
 *       200:
 *         description: Sales retrieved successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       500:
 *         description: Internal server error
 */
router.get("/get-all-sale", authenticateToken, requireRole(UserRole.AGENT), getSales);



/**
 * @swagger
 * /sales/client/{clientId}:
 *   get:
 *     tags: [Sales]
 *     summary: Get sales by client
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *         description: Client ID
 *
 *     responses:
 *
 *       200:
 *         description: Client sales retrieved successfully
 *
 *       500:
 *         description: Internal server error
 */
router.get("/client/:clientId", authenticateToken, requireRole(UserRole.AGENT), getSalesByClient);



/**
 * @swagger
 * /sales/get-sale/{id}:
 *   get:
 *     tags: [Sales]
 *     summary: Get sale by ID
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
 *         description: Sale ID
 *
 *     responses:
 *
 *       200:
 *         description: Sale found
 *
 *       404:
 *         description: Sale not found
 *
 *       500:
 *         description: Internal server error
 */
router.get("/get-sale/:id", authenticateToken, requireRole(UserRole.AGENT), getSaleById);



/**
 * @swagger
 * /sales/update-sale/{id}:
 *   put:
 *     tags: [Sales]
 *     summary: Update sale
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
 *         description: Sale ID
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             properties:
 *
 *               clientId:
 *                 type: string
 *
 *               amount:
 *                 type: number
 *
 *               description:
 *                 type: string
 *
 *               saleDate:
 *                 type: string
 *                 format: date-time
 *
 *     responses:
 *
 *       200:
 *         description: Sale updated successfully
 *
 *       400:
 *         description: Invalid amount
 *
 *       404:
 *         description: Sale or client not found
 *
 *       500:
 *         description: Internal server error
 */
router.put("/update-sale/:id", authenticateToken, requireRole(UserRole.EXECUTIVE), updateSale);



/**
 * @swagger
 * /sales/delete-sale/{id}:
 *   delete:
 *     tags: [Sales]
 *     summary: Deactivate sale
 *
 *     description: Performs logical deletion by setting isActive to false
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
 *     responses:
 *
 *       200:
 *         description: Sale deactivated successfully
 *
 *       404:
 *         description: Sale not found
 *
 *       500:
 *         description: Internal server error
 */
router.delete("/delete-sale/:id", authenticateToken, requireRole(UserRole.EXECUTIVE), deleteSale);

export default router;

