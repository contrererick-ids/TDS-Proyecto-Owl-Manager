// src/server/routes/document.routes.ts
import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware'
import { UserRole } from '../models/user.model'
import { uploadDocument, getDocumentsByEntity, downloadDocument, deleteDocument, replaceDocument } from '../controllers/document.controller';
import { upload } from '../config/multer.config';

const router = Router();

/**
 * @swagger
 * tags:
 *  - name: Documents
 *    description: File management using AWS S3 (upload, delete, retrieval)
 */


/**
 * @swagger
 * /documents/upload:
 *  post:
 *    tags: [Documents]
 *    summary: Upload a document
 *    description: Uploads a file to AWS S3 and associates it with a client
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            required:
 *              - file
 *              - clientId
 *            properties:
 *              file:
 *                type: string
 *                format: binary
 *              clientId:
 *                type: string
 *                example: 661a9c123abc456def789000
 *    responses:
 *      200:
 *        description: File uploaded successfully
 *      400:
 *        description: File or clientId missing
 */
router.post('/upload', upload.single('file'), authenticateToken, requireRole(UserRole.AGENT), uploadDocument);

/**
 * @swagger
 * /documents/get-all/:entityType/:{id}:
 *  get:
 *    tags: [Documents]
 *    summary: Get documents by client
 *    description: Returns all documents associated with a specific client
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: clientId
 *        required: true
 *        schema:
 *          type: string
 *        description: Client ID
 *    responses:
 *      200:
 *        description: Documents retrieved successfully
 *      404:
 *        description: Client not found
 */
router.get('/get-all/:entityType/:entityId', authenticateToken, requireRole(UserRole.AGENT), getDocumentsByEntity);

/**
 * @swagger
 * /documents/download/:entityType/:{id}/:fileName:
 *  get:
 *    tags: [Documents]
 *    summary: Download document
 *    description: Returns a signed URL or direct file download from S3
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: File download URL generated
 */
router.get('/download/:entityType/:entityId/:fileName', authenticateToken, requireRole(UserRole.AGENT), downloadDocument);

/**
 * @swagger
 * /documents/replace/:entityType/:{id}/:fileName:
 *  put:
 *    tags: [Documents]
 *    summary: Replace document
 *    description: Replaces an existing document file in AWS S3 and updates its metadata in the database
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Document ID
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            required:
 *              - file
 *            properties:
 *              file:
 *                type: string
 *                format: binary
 *              clientId:
 *                type: string
 *                example: 661a9c123abc456def789000
 *    responses:
 *      200:
 *        description: Document replaced successfully
 *      400:
 *        description: File missing or invalid request
 *      404:
 *        description: Document not found
 */
router.put('/replace/:entityType/:entityId/:fileName', authenticateToken, requireRole(UserRole.AGENT), upload.single('file'), replaceDocument);

/**
 * @swagger
 * /documents/delete/:entityType/:{id}/:fileName:
 *  delete:
 *    tags: [Documents]
 *    summary: Delete document
 *    description: Deletes a document permanently from AWS S3 and database
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Document ID
 *    responses:
 *      200:
 *        description: Document deleted successfully
 *      404:
 *        description: Document not found
 */
router.delete('/delete/:entityType/:entityId/:fileName', authenticateToken, requireRole(UserRole.AGENT), deleteDocument);

export default router;