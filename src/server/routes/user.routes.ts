import { Router } from 'express';
import * as user from '../controllers/user.controller';

const router = Router();

router.post('/user', user.createUser);

router.get('/user', user.getAllUsers);

router.get('/user/:id', user.getUserById);

router.put('/user/:id', user.updateUser);

router.delete('/user/:id', user.deleteUser);

export default router;