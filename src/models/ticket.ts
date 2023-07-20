import { Schema, model } from "mongoose";

const ticket = new Schema<ITicket>({
    title: {
        required: true,
        type: String,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        default: 'To do'
    },
    type: {
        type: String,
        required: true,
    },
    assignee: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    reporter: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    due_date: {
        type: Date,
    },
    priority: {
        required: true,
        default: 'medium',
        type: String,
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'ticket_comment',
        }
    ]
}, {timestamps: true,versionKey: false} );

module.exports = model<ITicket>('Ticket', ticket);