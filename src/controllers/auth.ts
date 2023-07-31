import dotenv from "dotenv";
dotenv.config();
import { User } from "../models/user";
import { Token } from "../models/token";
import bcrypt from 'bcrypt';
import { validationResult } from "express-validator";
import { Request, NextFunction, Response } from "express";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
const utils = require('../utils/utils');

exports.signup = async (req: Request, res: Response, next: NextFunction) => {
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

exports.login = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const error = new Error('Validation error') as ResponseError;
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

      const {email,password} = req.body;

      const user = await User.findOne({email: email});

      if(!user) {
        const error = new Error('Account does not exist') as ResponseError;
            error.statusCode = 422;
            throw error;
      }

      if(!user.isVerified) {
      return res.status(200).json({
            message: 'Account has not yet been verified',
        });
      }

      const isEqual = await bcrypt.compare(password, user.password);

      if(!isEqual) {
        const error = Error('Incorrect password') as ResponseError;
        error.statusCode = 422;
        throw error;
      }

      const token = jwt.sign({
        email: user.email,
        userId: user._id,
      }, process.env.JWT_TOKEN);

      res.status(200).json({
        token: token,
      });

    } catch(error) {
        next(error);
    }
}

exports.verifyToken = async (req: Request, res: Response, next: NextFunction) => {
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

exports.resendVerification = async (req: Request, res: Response, next: NextFunction) => {
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

exports.retrieve = async (req: CustomRequest, res: Response, next: NextFunction) => {
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