import { ValidationError } from "express-validator"
import mongoose from "mongoose"

export {};

declare global {

    // type for a user model
    interface IUser {
        email: string,
        name: string,
        password: string,
        isVerified: boolean,
    }

    interface IOrganisation {
        name: string,
        projects: IProject[],
    }

    interface IProject {
        name: string,
        tickets: ITicket[],
        isFavorite: boolean,
        isPublic: boolean,
    }

    interface ITicket {
        title: string,
        description: string,
        status: string,
        type: string,
        assignee: mongoose.Types.ObjectId,
        reporter: mongoose.Types.ObjectId,
        due_date: Date,
        priority: string,
        comments: ITicketComment[],
    }

    interface ITicketComment {
        user: mongoose.Types.ObjectId,
        comment: string,
    }

    // type for a token
    interface IToken {
        userId: mongoose.Types.ObjectId,
        token: string,
    }

    // interface for response error
    type ResponseError = Error & {
        data: ValidationError[],
        statusCode: number,
    }
}