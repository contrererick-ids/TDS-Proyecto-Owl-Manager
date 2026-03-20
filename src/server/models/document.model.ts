import { Schema, model, Document, Types } from 'mongoose';

// Document Schema
const tableDocument = new Schema({
    entityType: {
        type: String,
        required: true
    },

    entityId: {
        type: Types.ObjectId,
        required: true
    },

    uploadedBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },

    fileName: {
        type: String,
        required: true
    },

    fileUrl: {
        type: String,
        required: true
    },

    mimeType: {
        type: String
    }

}, { timestamps: true });

// Document Model Interface
export interface IDocument extends Document {
    entityType: string;
    entityId: Types.ObjectId;
    uploadedBy: Types.ObjectId;
    fileName: string;
    fileUrl: string;
    mimeType?: string;
    createdAt: Date;
    updatedAt: Date;
}

export default model<IDocument>('Document', tableDocument);