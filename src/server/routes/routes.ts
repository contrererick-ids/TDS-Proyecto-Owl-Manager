import { Router } from "express";
import authRoutes from './auth.routes';
import userRoutes from "./user.routes";
import clientRoutes from "./client.routes";

const router = Router();

// Ruta de autenticación (login)
router.use('/auth', authRoutes);

// Rutas de usuario
router.use('/users', userRoutes);

// Rutas de clientes
router.use("/clients", clientRoutes);

export default router;