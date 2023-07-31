import dotenv from "dotenv";
dotenv.config();
import { User } from "../../models/user";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { Request, NextFunction, Response } from "express";

module.exports = async (req: Request, res: Response, next: NextFunction) => {

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