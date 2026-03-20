import { Schema, model, Document } from 'mongoose';

export enum UserRole {
    ADMIN = 'Administrador',
    EXECUTIVE = 'Ejecutivo',
    AGENT = 'Agente'
}

// User Schema
const tableUser = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.AGENT },
    isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// User Model Interface
export interface IUser extends Document {
    username: string;
    password: string;
    name: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export default model<IUser>('User', tableUser);