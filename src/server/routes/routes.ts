import { Router } from "express";
import authRoutes from './auth.routes.js';
import userRoutes from "./user.routes.js";
import clientRoutes from "./client.routes.js";
import ticketRoutes from "./ticket.routes.js";
import documentRoutes from "./document.routes.js";
import saleRoutes from "./sale.routes.js";

const router = Router();

// Ruta de autenticación (login)
router.use('/auth', authRoutes);

// Rutas de usuario
router.use('/users', userRoutes);

// Rutas de clientes
router.use("/clients", clientRoutes);

// Rutas de tickets
router.use("/tickets", ticketRoutes);

// Rutas de los documentos
router.use("/documents", documentRoutes);

// Rutas de las ventas
router.use("/sales", saleRoutes);

export default router;