import { Schema, model, Document, Types } from 'mongoose';

// Sale Schema
const tableSale = new Schema({
    clientId: {
        type: Types.ObjectId,
        ref: 'Client',
        required: true
    },

    registeredBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    description: {
        type: String
    },

    saleDate: {
        type: Date,
        required: true
    }

}, { timestamps: true });

// Sale Model Interface
export interface ISale extends Document {
    clientId: Types.ObjectId;
    registeredBy: Types.ObjectId;
    amount: number;
    description?: string;
    saleDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

export default model<ISale>('Sale', tableSale);