import mongoose, { Schema, model, Document, Types } from 'mongoose';

// Sale Schema
const tableSale = new Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
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
        required: true,
        min: 1
    },

    description: {
        type: String,
        trim: true,
        maxlength: 200
    },

    saleDate: {
        type: Date,
        default: Date.now
    },
    
    isActive: {
        type: Boolean,
        default: true
    },
    

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