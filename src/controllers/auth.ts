import dotenv from "dotenv";
dotenv.config();
import { User } from "../models/user";
import bcrypt from 'bcrypt';
import { validationResult } from "express-validator";
import { Request, NextFunction, Response } from "express";
import jwt from 'jsonwebtoken';

import {ErrorResponse} from '../types/express_types';

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

        // success creating the user account
        res.status(200).json({
            id: result._id,
            name: result.name,
            email: result.email,
        });

    } catch(error) {
        next(error);
    }
}

exports.login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const error = new Error('Validation error') as ErrorResponse;
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
      const {email,password} = req.body;
      const user = await User.findOne({email: email});

      if(!user) {
        const error = new Error('Account does not exist') as ErrorResponse;
            error.statusCode = 422;
            throw error;
      }

      const isEqual = bcrypt.compare(password, user.password);

      if(!isEqual) {
        const error = Error('Incorrect password') as ErrorResponse;
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