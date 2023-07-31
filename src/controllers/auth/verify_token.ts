import dotenv from "dotenv";
dotenv.config();
import { User } from "../../models/user";
import { Token } from "../../models/token";
import { Request, NextFunction, Response } from "express";

module.exports = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tokenParam = req.body.token;
        const email = req.body.email;

        const token = await Token.findOne({token: tokenParam});

        if(!token) {
            const error = new Error('Token is no longer available, please request again') as ResponseError;
            error.statusCode = 400;
            throw error;
        }

        const user = await User.findOne({_id: token.userId, email: email});

        if(!user) {
            const error = new Error('No account is associated with this email address') as ResponseError;
            error.statusCode = 400;
            throw error;
        }

        if(user.isVerified) {
            const error = new Error('User has already been verified please login') as ResponseError;
            error.statusCode = 200;
            throw error;
        }

        user.isVerified = true;

        await user.save();

        token.deleteOne();

        res.status(200).json({
            message: 'Your account has been successfully verified',
        });
    }
    catch(err) {
        next(err);
    }
    
}