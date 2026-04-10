import { Router } from 'express';
import { createClient, getClients, getClientById, updateClient, deleteClient, assignClientToUser } from '../controllers/client.controller';

const router = Router();

// Rutas CRUD para clientes
router.post('/new-client', createClient);
router.get('/get-all-clients', getClients);
router.get('/get-client/:id', getClientById);
router.put('/update-client/:id', updateClient);
router.delete('/delete-client/:id', deleteClient);
router.patch('/assign-client/:id', assignClientToUser);

export default router;