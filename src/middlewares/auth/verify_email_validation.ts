import {check} from 'express-validator'
import {Request, Response, NextFunction} from 'express';
import {User} from '../../models/user';

module.exports = (req:Request, res: Response, next: NextFunction) => {
    check('email', 'Invalid email address').isEmail().custom(async (email: string, {req}) => {
        const userDoc = await User.findOne({ email: email });
        // check if email is already existing
        if (userDoc) {
            return Promise.reject('Email address already exists');
        }
     }).bail()
}