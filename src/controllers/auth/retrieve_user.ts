import dotenv from "dotenv";
dotenv.config();
import { User } from "../../models/user";
import { NextFunction, Response } from "express";

module.exports = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const userId = req.userId;
    try{
        const currentUser = await User.findById(userId).select('-password');
        if(!currentUser) {
            const error = new Error('No user found') as ResponseError;
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(currentUser);
    } catch(err) {
        next(err);
    }
}