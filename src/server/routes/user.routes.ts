import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware'
import { UserRole } from '../models/user.model'
import { createUser, getUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller';

const router = Router();

// Rutas CRUD para usuarios
router.post('/create-new-user', authenticateToken, requireRole(UserRole.ADMIN), createUser);
router.get('/get-all-users', authenticateToken, requireRole(UserRole.EXECUTIVE), getUsers);
router.get('/get-user/:id', authenticateToken, requireRole(UserRole.EXECUTIVE), getUserById);
router.put('/update-user/:id', authenticateToken, requireRole(UserRole.ADMIN), updateUser);
router.delete('/delete-user/:id', authenticateToken, requireRole(UserRole.ADMIN), deleteUser);

export default router;