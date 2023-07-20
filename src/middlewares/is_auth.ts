import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

module.exports = (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        // get the header from the incoming request
    const authHeader = req.get('Authorization');

    // throw error if auth header is not set
    if(!authHeader) {
        const error = new Error('Not authenticated') as ResponseError
        error.statusCode = 401;
        throw error;
    }

    const token = authHeader.split(' ')[1];

    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);

    if(!decodedToken) {
        const error = new Error('Auth key is wrong') as ResponseError
        error.statusCode = 401;
        throw error;
    }

    req.userId = (decodedToken as any).userId;
    req.email = (decodedToken as any).email;

    next();
    } catch(err) {
        next(err);
    }

};
