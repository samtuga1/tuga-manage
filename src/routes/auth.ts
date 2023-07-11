import express from 'express';
import {check} from 'express-validator';
import {User} from '../models/user';
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/signup', [
    check('email', 'Invalid email address').trim().isEmail().normalizeEmail().isLength({min: 5, max: 30}).withMessage('Email length cannot be less than 5 or exceed 30').custom((email: string, {req}) => {
        User.find({email: email}).then(userDoc => {

            // check if email is already existing
            if(userDoc) {
                return Promise.reject('Email address already exists')
            }
        })
    }),
    check('name', 'Invalid name').isLength({min: 2}).withMessage('Name cannot be less than two'),
    check('password').isLength({min: 8}).withMessage('Password cannot be less than 8 characters long'),
], authController.signup);

router.post('/login')

module.exports = router;