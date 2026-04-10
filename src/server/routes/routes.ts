import { Router } from "express";
import authRoutes from './auth.routes';
import userRoutes from "./user.routes";

const router = Router();

// Ruta de autenticación (login)
router.use('/auth', authRoutes);

// Rutas de usuario
router.use('/users', userRoutes);

export default router;