import { Schema, model, Document, Types } from 'mongoose';

enum TicketStatus {
    PENDING = 'Pendiente',
    IN_PROGRESS = 'En proceso',
    CLOSED = 'Cerrado',
    CANCELED = 'Cancelado'
}


interface IComment {
    ticketId: Types.ObjectId;
    authorId: Types.ObjectId;
    text: string;
    createdAt: Date;
}

// Ticket Schema
const tableTicket = new Schema({
    clientId: {
        type: Types.ObjectId,
        ref: 'Client',
        required: true
    },

    assignedTo: {
        type: Types.ObjectId,
        ref: 'User'
    },

    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },

    status: {
        type: String,
        enum: Object.values(TicketStatus),
        required: true,
        default: TicketStatus.PENDING
    },

    cancellationReason: {
        type: String
    },

    comments: [
        {
            ticketId: {
                type: Types.ObjectId,
                ref: 'Ticket',
                required: true
            },
            authorId: {
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
    ]

}, { timestamps: true });


// Ticket Model Interface
export interface ITicket extends Document {
    clientId: Types.ObjectId;
    assignedTo?: Types.ObjectId;
    createdBy: Types.ObjectId;
    status: TicketStatus;
    cancellationReason?: string;
    comments: IComment[];
    createdAt: Date;
    updatedAt: Date;
}

export default model<ITicket>('Ticket', tableTicket);
