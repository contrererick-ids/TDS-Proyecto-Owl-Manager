// src/server/routes/document.routes.ts
import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware'
import { UserRole } from '../models/user.model'
import { uploadDocument, getDocumentsByEntity, downloadDocument, deleteDocument, replaceDocument } from '../controllers/document.controller';
import { upload } from '../config/multer.config';

const router = Router();

router.post('/upload', upload.single('file'), authenticateToken, requireRole(UserRole.AGENT), uploadDocument);
router.get('/get-all/:entityType/:entityId', authenticateToken, requireRole(UserRole.AGENT), getDocumentsByEntity);
router.get('/download/:entityType/:entityId/:fileName', authenticateToken, requireRole(UserRole.AGENT), downloadDocument);
router.put('/replace/:entityType/:entityId/:fileName', authenticateToken, requireRole(UserRole.AGENT), upload.single('file'), replaceDocument);
router.delete('/delete/:entityType/:entityId/:fileName', authenticateToken, requireRole(UserRole.AGENT), deleteDocument);

export default router;