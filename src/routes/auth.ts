import express from 'express';
import {check} from 'express-validator';
import {User} from '../models/user';
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/signup', [
    check('email', 'Invalid email address').isEmail().custom((email: string, {req}) => {
       return User.findOne({email: email}).then(userDoc => {
            // check if email is already existing
            if(userDoc) {
                return Promise.reject('Email address already exists');
            }
        })
    }).bail(),
    check('name', 'Invalid name').notEmpty().withMessage('Name cannot be empty').bail(),
    check('password').isLength({min: 8}).withMessage('Password cannot be less than 8 characters long').bail(),
], authController.signup);

router.post('/login', [
    check('email', 'Invalid email address').isEmail().bail(),
], authController.login)

router.post('/login')

module.exports = router;