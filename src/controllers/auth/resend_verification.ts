import dotenv from "dotenv";
dotenv.config();
import { User } from "../../models/user";
import { Token } from "../../models/token";
import { Request, NextFunction, Response } from "express";
import nodemailer from 'nodemailer';
const utils = require('../../utils/utils');

module.exports = async (req: Request, res: Response, next: NextFunction) => {
    try {

    const email = req.body.email;

    const user = await User.findOne({email: email});

    if(!user) {
        const error = new Error('We were unable to find a user with that email. Make sure your Email is correct!') as ResponseError;
        error.statusCode = 422;
        throw error;
    }

    if(user.isVerified) {
       return res.status(200).json({
            message: 'Account has already been verified, please login',
        });
    }

    const token = new Token({
        userId: email,
        token: utils.randomCharacters(6),//crypto.randomBytes(16).toString('hex'),
    });

    await token.save();

    // define the tranporter for sending emails
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {user: process.env.NODE_MAILER_EMAIL, pass: process.env.NODE_MAILER_PASSWORD},
      });

      // use our transporter to send the email to the user
    transporter.sendMail({
        from: 'TugaManager@gmail.com', 
        to: user.email, 
        subject: "Account Verification Link", 
        text: 'Hello '+ req.body.name +',\n\n' + 'Your verification code is ' + token.token + ' \n\nThank You!\n',
      }, (err) => {
        if(err) {
            const error = new Error('Something happened, please try again later') as ResponseError;
            error.statusCode = 500;
            throw error;
        }
        res.status(200).json({
            message: 'A verification email has been sent to ' + user.email + '. If you not get verification Email click on resend token',
        })
      });
    } catch(err) {
        next(err);
    }
    
}