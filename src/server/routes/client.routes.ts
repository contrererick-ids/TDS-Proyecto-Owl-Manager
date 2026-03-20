import { Router } from 'express';
import * as client from '../controllers/client.controller';

const router = Router();

router.post('/client', client.createClient);

router.get('/client', client.getAllClients);

router.get('/client/:id', client.getClientById);

router.put('/client/:id', client.updateClient);

router.delete('/client/:id', client.deleteClient);

router.patch('/client/:id/assign', client.assignClientToUser);

export default router;