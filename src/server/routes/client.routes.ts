import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware'
import { UserRole } from '../models/user.model'
import { createClient, getClients, getClientById, updateClient, deleteClient, assignClientToUser } from '../controllers/client.controller';

const router = Router();

// Rutas CRUD para clientes
router.post('/new-client', authenticateToken, requireRole(UserRole.EXECUTIVE), createClient);
router.get('/get-all-clients', authenticateToken, requireRole(UserRole.AGENT), getClients);
router.get('/get-client/:id', authenticateToken, requireRole(UserRole.AGENT), getClientById);
router.put('/update-client/:id', authenticateToken, requireRole(UserRole.EXECUTIVE), updateClient);
router.delete('/delete-client/:id', authenticateToken, requireRole(UserRole.EXECUTIVE), deleteClient);
router.patch('/assign-client/:id', authenticateToken, requireRole(UserRole.EXECUTIVE), assignClientToUser);

export default router;