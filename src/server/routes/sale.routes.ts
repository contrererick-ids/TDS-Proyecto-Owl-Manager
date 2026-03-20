import app from '../app';
import { SaleController } from "../controllers/sale.controller";

const saleController = new SaleController();

// Crear venta
app.post("/sales", saleController.createSale);

// Listar ventas
app.get("/sales", saleController.getSales);

// Obtener venta por ID
app.get("/sales/:id", saleController.getSaleById);

// Ventas por cliente
app.get("/sales/client/:clientId", saleController.getSalesByClient);

export default app;