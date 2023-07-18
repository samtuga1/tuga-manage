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
}, {timestamps: true});

module.exports = model<ITicketComment>('ticket_comment', ticket_comment);