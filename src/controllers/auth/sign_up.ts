import dotenv from "dotenv";
dotenv.config();
import { User } from "../../models/user";
import { Token } from "../../models/token";
import bcrypt from 'bcrypt';
import { validationResult } from "express-validator";
import { Request, NextFunction, Response } from "express";
import nodemailer from 'nodemailer';
const utils = require('../../utils/utils');

module.exports = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // check for the validation errors
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const error = new Error('Validation error') as ResponseError;
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

        const savedUser = await user.save();

        const token = new Token({
            userId: savedUser._id,
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
            to: process.env.NODE_MAILER_EMAIL, 
            subject: "Account Verification Link", 
            text: 'Hello '+ req.body.name +',\n\n' + 'Your verification code is ' + token.token + ' \n\nThank You!\n',
          }, (err) => {
            if(err) {
                const error = new Error('Something happened, please try again later') as ResponseError;
                error.statusCode = 500;
                throw error;
            }
            res.status(200).json({
                message: 'A verification code has been sent to ' + email + '.',
            })
          });

    } catch(error) {
        next(error);
    }
}