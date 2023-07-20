import {Schema, model} from 'mongoose';

const ticket_comment = new Schema<ITicketComment>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    comment: {
        type: String,
        required: true,
    }
}, {timestamps: true, versionKey: false,});

module.exports = model<ITicketComment>('Ticket_comment', ticket_comment);