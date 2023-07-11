import { User, UserType } from "../models/user";
import bcrypt from 'bcrypt';
import { validationResult } from "express-validator";
import {ErrorResponse} from '../types/express_types';
import { Request, NextFunction, Response } from "express";

interface Error {
    statusCode?: number;
}

exports.signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // check for the validation errors
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const error = new Error('Validation error') as ErrorResponse;
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        // extract data that is coming in
        const {email, name, password} = req.body;

        // hash the password before sending to db
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
        });

        const result = await user.save();

        res.status(200).json({
            id: result._id,
            result: result.toJSON(),
        });

    } catch(error) {
        next(error);
    }
}