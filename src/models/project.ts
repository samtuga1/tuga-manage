import { Schema, model } from "mongoose";

const project_schema = new Schema<IProject>({
    name: {
        type: String,
        required: true,
    },
    tickets: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Ticket',
        },
    ],
    isFavorite: {
        type: Boolean,
        default: false,
    },
    isPublic: {
        type: Boolean,
        default: false,
    }
}, {versionKey: false,});

module.exports = model('project', project_schema);