import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { createUser, getUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller';

const router = Router();

// Ruta protegida
router.get('/me', authenticateToken, (req: Request, res: Response) => {
    res.json({ message: 'Token válido', user: (req as any).user });
});

// Rutas CRUD para usuarios
router.post('/create-new-user', createUser);
router.get('/get-all-users', getUsers);
router.get('/get-user/:id', getUserById);
router.put('/update-user/:id', updateUser);
router.delete('/delete-user/:id', deleteUser);

export default router;