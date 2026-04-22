// src/server/routes/document.routes.ts
import { Router } from 'express';
import { uploadDocument, getDocumentsByEntity, downloadDocument, deleteDocument, replaceDocument } from '../controllers/document.controller';
import { upload } from '../config/multer.config';

const router = Router();

router.post('/upload', upload.single('file'), uploadDocument);
router.get('/get-all/:entityType/:entityId', getDocumentsByEntity);
router.get('/download/:entityType/:entityId/:fileName', downloadDocument);
router.put('/replace/:entityType/:entityId/:fileName', upload.single('file'), replaceDocument);
router.route('/delete/:entityType/:entityId/:fileName').delete(deleteDocument);

export default router;