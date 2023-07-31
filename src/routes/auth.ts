import express from 'express';
import {check} from 'express-validator';
const router = express.Router();

const signUpController = require('../controllers/auth/sign_up');
const loginController = require('../controllers/auth/login');
const verifyTokenController = require('../controllers/auth/verify_token');
const retrieveUserController = require('../controllers/auth/retrieve_user');
const resendVerificationController = require('../controllers/auth/resend_verification');
const isAuth = require('../middlewares/is_auth');
const signUpValidator = require('../middlewares/auth/sign_up_validation');
const loginValidator = require('../middlewares/auth/login_validation');
const verifyEmailValidation = require('../middlewares/auth/verify_email_validation');

router.post('/signup', signUpValidator, signUpController);

router.post('/login', loginValidator, loginController);

router.post('/verify', verifyEmailValidation,verifyTokenController);

 router.get('/retrieve', isAuth, retrieveUserController),

 router.post('/resend/verification', resendVerificationController);