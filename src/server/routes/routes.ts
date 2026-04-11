import { Router } from "express";
import authRoutes from './auth.routes';
import userRoutes from "./user.routes";
import clientRoutes from "./client.routes";
import ticketRoutes from "./ticket.routes";
import documentRoutes from "./document.routes";
import saleRoutes from "./sale.routes";

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