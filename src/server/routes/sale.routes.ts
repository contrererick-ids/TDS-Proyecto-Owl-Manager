import { Router } from "express";
import * as saleController from "../controllers/sale.controller";

const router = Router();

// Crear venta
router.post("/sales", saleController.createSale);

// Listar ventas
router.get("/sales", saleController.getSales);

// Obtener venta por ID
router.get("/sales/:id", saleController.getSaleById);

// Ventas por cliente
router.get("/sales/client/:clientId", saleController.getSalesByClient);

export default router;