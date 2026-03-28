import { Schema, model, Document, Types } from 'mongoose';

enum TicketStatus {
    PENDING = 'Pendiente',
    IN_PROGRESS = 'En proceso',
    CLOSED = 'Cerrado',
    CANCELED = 'Cancelado'
}

// Comment Model Interface
interface IComments extends Document {
    commentId: Types.ObjectId;
    commentAuthorId: Types.ObjectId;
    text?: string;
    createdAt: Date;
}

// Ticket Schema
const tableTicket = new Schema({
    ticketId: {
        type: Types.ObjectId,
        ref: 'Ticket',
        required: true
    },

    requestName: {
        type: String,
        required: true,
    },

    clientId: {
        type: Types.ObjectId,
        ref: 'Client',
        required: true
    },
    
    comments: [
        {
            commentId: {
                type: Types.ObjectId,
                ref: 'Comment',
                required: true
            },

            commentAuthorId: {
                type: Types.ObjectId,
                ref: 'User',
                required: true
            },
            text: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    
    assignedTo: {
        type: Types.ObjectId,
        ref: 'User'
    },

    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },

    createdAt: {
        type: Date,
        required: true,
        deault: Date.now
    },

    lastModifiedDate: {
        type: Date,
        required: true,
        deault: Date.now
    },

    status: {
        type: String,
        enum: Object.values(TicketStatus),
        required: true,
        default: TicketStatus.PENDING
    },

}, { timestamps: true });

// Ticket Model Interface
export interface ITicket extends Document {
    ticketId: Types.ObjectId;
    requestName?: string;
    clientId: Types.ObjectId;
    comments: IComments[];
    assignedTo?: Types.ObjectId;
    createdBy: Types.ObjectId;
    createdAt: Types.ObjectId;
    lastModifiedDate: Types.ObjectId;
    status: TicketStatus;
}

export default model<ITicket>('Ticket', tableTicket);
