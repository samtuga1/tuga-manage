import {Schema, model} from "mongoose";

const tokenSchema = new Schema<IToken>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    token: {
        type: String,
        required: true,
    },
});

export const Token = model<IToken>('Token', tokenSchema);