import app from '../app';
import { SaleController } from "../controllers/sale.controller";

const saleController = new SaleController();

// Crear venta
app.post("/", saleController.createSale);

// Listar ventas
app.get("/", saleController.getSales);

// Obtener venta por ID
app.get("/:id", saleController.getSaleById);

// Ventas por cliente
app.get("/client/:clientId", saleController.getSalesByClient);

export default app;