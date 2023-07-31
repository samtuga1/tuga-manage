import { Request, Response, NextFunction } from "express";
import {check} from 'express-validator';
import {User} from '../../models/user';

module.exports = (req: Request, res: Response, next: NextFunction) => {
    [
        check('email', 'Invalid email address').isEmail().custom( async (email: string, {req}) => {
           return User.findOne({email: email}).then(userDoc => {
                // check if email is already existing
                if(userDoc) {
                    return Promise.reject('Email address already exists');
                }
            })
        }).bail(),
        check('name', 'Invalid name').notEmpty().withMessage('Name cannot be empty').bail(),
        check('password').isLength({min: 8}).withMessage('Password cannot be less than 8 characters long').bail(),
    ]
    next();
}