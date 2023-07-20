import { Request } from "express";
import { ValidationError } from "express-validator"
import mongoose, { ObjectId } from "mongoose"

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
        creatorId: mongoose.Types.ObjectId,
        projects: IProject[],
        members: IUser[],
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

    interface CustomRequest extends Request {
        userId: string,
        email: string,
    }
}