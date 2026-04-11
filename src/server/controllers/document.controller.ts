import { Request, Response } from 'express';
import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3, BUCKET_NAME } from '../config/s3.config';
import DocumentModel from '../models/document.model';
import User from '../models/user.model';
import Client from '../models/client.model';
import Ticket from '../models/ticket.model';

export const uploadDocument = async (req: Request, res: Response) => {
    try {
        const { entityType, entityId, uploadedBy } = req.body;
        const file = req.file;

        if (!entityType || !entityId || !uploadedBy || !file) {
            return res.status(400).json({ message: 'entityType, entityId, uploadedBy and file are required.' });
        }

        if (entityType !== 'ticket' && entityType !== 'client') {
            return res.status(400).json({ message: 'entityType must be "ticket" or "client".' });
        }

        // Validar que la entidad existe
        if (entityType === 'ticket') {
            const ticket = await Ticket.findOne({ ticketId: entityId });
            if (!ticket) {
                return res.status(404).json({ message: `Ticket "${entityId}" not found.` });
            }
        } else {
            const client = await Client.findOne({ name: entityId });
            if (!client) {
                return res.status(404).json({ message: `Client "${entityId}" not found.` });
            }
        }

        // Validar usuario que sube el documento
        const user = await User.findOne({ name: uploadedBy });
        if (!user) {
            return res.status(404).json({ message: `User "${uploadedBy}" not found.` });
        }

        // Verificar que no exista ya un documento con ese nombre en la misma entidad
        const existingDocument = await DocumentModel.findOne({ entityType, entityId, fileName: file.originalname });
        if (existingDocument) {
            return res.status(400).json({ message: `A document named "${file.originalname}" already exists. Use the replace endpoint instead.` });
        }

        const s3Key = `${entityType}s/${entityId}/${file.originalname}`;

        await s3.send(new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: s3Key,
            Body: file.buffer,
            ContentType: file.mimetype
        }));

        const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

        const newDocument = new DocumentModel({
            entityType,
            entityId,
            uploadedBy: user._id,
            fileName: file.originalname,
            fileUrl,
            mimeType: file.mimetype
        });

        const savedDocument = await newDocument.save();
        res.status(201).json(savedDocument);
    } catch (error) {
        res.status(500).json({ message: 'Error uploading document', error });
    }
};

export const getDocumentsByEntity = async (req: Request, res: Response) => {
    try {
        const { entityType, entityId } = req.params;

        if (entityType !== 'ticket' && entityType !== 'client') {
            return res.status(400).json({ message: 'entityType must be "ticket" or "client".' });
        }

        const documents = await DocumentModel.find({ entityType, entityId })
            .populate('uploadedBy', 'name email')
            .select('fileName mimeType createdAt uploadedBy');

        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching documents', error });
    }
};

export const downloadDocument = async (req: Request, res: Response) => {
    try {
        const { entityType, entityId, fileName } = req.params;

        if (entityType !== 'ticket' && entityType !== 'client') {
            return res.status(400).json({ message: 'entityType must be "ticket" or "client".' });
        }

        const document = await DocumentModel.findOne({ entityType, entityId, fileName });
        if (!document) {
            return res.status(404).json({ message: `Document "${fileName}" not found.` });
        }

        // Generar URL prefirmada con expiración de 5 minutos para descarga
        const s3Key = `${entityType}s/${entityId}/${fileName}`;
        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: s3Key,
            ResponseContentDisposition: `attachment; filename="${fileName}"`
        });

        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
        res.status(200).json({ downloadUrl: signedUrl });
    } catch (error) {
        res.status(500).json({ message: 'Error downloading document', error });
    }
};

export const deleteDocument = async (req: Request, res: Response) => {
    try {
        const { entityType, entityId, fileName } = req.params;

        if (entityType !== 'ticket' && entityType !== 'client') {
            return res.status(400).json({ message: 'entityType must be "ticket" or "client".' });
        }

        const document = await DocumentModel.findOne({ entityType, entityId, fileName });
        if (!document) {
            return res.status(404).json({ message: `Document "${fileName}" not found.` });
        }

        const s3Key = `${entityType}s/${entityId}/${fileName}`;

        await s3.send(new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: s3Key
        }));

        await DocumentModel.findByIdAndDelete(document._id);
        res.status(200).json({ message: 'Document deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting document', error });
    }
};

export const replaceDocument = async (req: Request, res: Response) => {
    try {
        const { entityType, entityId, fileName } = req.params;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'A file is required.' });
        }

        if (entityType !== 'ticket' && entityType !== 'client') {
            return res.status(400).json({ message: 'entityType must be "ticket" or "client".' });
        }

        const document = await DocumentModel.findOne({ entityType, entityId, fileName });
        if (!document) {
            return res.status(404).json({ message: `Document "${fileName}" not found.` });
        }

        const s3Key = `${entityType}s/${entityId}/${fileName}`;

        // Eliminar archivo viejo de S3 y subir el nuevo con la misma key
        await s3.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: s3Key }));
        await s3.send(new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: s3Key,
            Body: file.buffer,
            ContentType: file.mimetype
        }));

        // Actualizar mimeType en caso de que el nuevo archivo sea diferente
        document.mimeType = file.mimetype;
        await document.save();

        res.status(200).json({ message: 'Document replaced successfully.', document });
    } catch (error) {
        res.status(500).json({ message: 'Error replacing document', error });
    }
};