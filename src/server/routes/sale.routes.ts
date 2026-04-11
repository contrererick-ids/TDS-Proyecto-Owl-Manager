import { Router } from "express";
import { authenticateToken } from '../middlewares/auth.middleware';
import { createSale, getSales, getSaleById, updateSale, deleteSale, getSalesByClient } from "../controllers/sale.controller";

const router = Router();

router.post("/create-new-sale", createSale);
router.get("/get-all-sale", getSales);
router.get("/client/:clientId", getSalesByClient);
router.get("/get-sale/:id", getSaleById);
router.put("/update-sale/:id", updateSale);
router.delete("/delete-sale/:id", deleteSale);

export default router;
