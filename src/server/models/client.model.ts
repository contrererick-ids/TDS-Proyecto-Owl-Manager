import { Schema, model, Document, Types } from 'mongoose';

// CLient Schema
const tableClient = new Schema({
    name: { type: String, required: true, unique: true},
    email: { type: String },
    phone: { type: String },
    company: { type: String },
    
    assignedTo: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Client Model Interface
export interface IClient extends Document {
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    assignedTo: Types.ObjectId;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export default model<IClient>('Client', tableClient);