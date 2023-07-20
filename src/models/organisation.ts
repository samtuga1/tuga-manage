import { Schema, model } from "mongoose";

const organisation_schema = new Schema<IOrganisation>({
    name: {
        type: String,
        required: true,
    },
    projects: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Project',
        },
    ],
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
}, {versionKey: false},);

export const Organisation = model('Organisation', organisation_schema);