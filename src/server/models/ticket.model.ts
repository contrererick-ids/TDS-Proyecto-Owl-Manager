import { Schema, model, Document, Types } from 'mongoose';

export enum TicketStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROCESS',
    CLOSED = 'CLOSED',
    CANCELED = 'CANCELED'
}

export interface IComments {
    commentAuthorId: Types.ObjectId;
    text: string;
    createdAt: Date;
}

const tableTicket = new Schema({
    ticketId: {
        type: String,
        unique: true,
        required: true
    },
    // Asunto del folio o trámite a realizar
    requestName: {
        type: String,
        required: true
    },

    clientId: {
        type: Types.ObjectId,
        ref: 'Client',
        required: true
    },

    comments: [
        {
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

    lastModifiedDate: {
        type: Date,
        default: Date.now
    },

    status: {
        type: String,
        enum: Object.values(TicketStatus),
        required: true,
        default: TicketStatus.PENDING
    },
    cancelReason: {
        type: String,
        required: false
    }

}, { timestamps: true });

export interface ITicket extends Document {
    ticketId: string;
    requestName: string;
    clientId: Types.ObjectId;
    comments: IComments[];
    assignedTo?: Types.ObjectId;
    createdBy: Types.ObjectId;
    lastModifiedDate: Date;
    status: TicketStatus;
    cancelReason: string;
}

export default model<ITicket>('Ticket', tableTicket);
