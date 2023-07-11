import mongoose from "mongoose";

export type UserType = mongoose.Document & {
    email: string,
    name: string,
    password: string,
}

const userSchema = new mongoose.Schema<UserType>({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});

export const User = mongoose.model<UserType>('User', userSchema);