import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Ruta protegida
router.get('/me', authenticateToken, (req: Request, res: Response) => {
    res.json({ message: 'Token válido', user: (req as any).user });
});

export default router;