import { Router } from "express";
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware'
import { UserRole } from '../models/user.model'
import { createSale, getSales, getSaleById, updateSale, deleteSale, getSalesByClient } from "../controllers/sale.controller";

const router = Router();

router.post("/create-new-sale", authenticateToken, requireRole(UserRole.EXECUTIVE), createSale);
router.get("/get-all-sale", authenticateToken, requireRole(UserRole.AGENT), getSales);
router.get("/client/:clientId", authenticateToken, requireRole(UserRole.AGENT), getSalesByClient);
router.get("/get-sale/:id", authenticateToken, requireRole(UserRole.AGENT), getSaleById);
router.put("/update-sale/:id", authenticateToken, requireRole(UserRole.EXECUTIVE), updateSale);
router.delete("/delete-sale/:id", authenticateToken, requireRole(UserRole.EXECUTIVE), deleteSale);

export default router;

