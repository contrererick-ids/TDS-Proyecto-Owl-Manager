import { Router } from 'express';
import * as document from '../controllers/document.controller';

const router = Router();

router.post('/document', document.createDocument);

router.get('/document/:id', document.getDocumentById);

router.get('/documents', document.getAllDocuments);

router.delete('/document/:id', document.deleteDocument);

export default router;