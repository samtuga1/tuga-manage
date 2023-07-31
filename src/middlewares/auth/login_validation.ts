import {check} from 'express-validator';
import { Request, Response, NextFunction } from 'express';

module.exports = (req: Request, res: Response, next: NextFunction) => {
    [
        check('email', 'Invalid email address').isEmail().bail(),
    ]
    next();
}