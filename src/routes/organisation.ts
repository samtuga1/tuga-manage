import { Router } from "express";

const organisationController = require('../controllers/organisation');
const isAuth = require('../middlewares/is_auth');

const router = Router();

router.get('/retreive',isAuth, organisationController.retrieve);

router.post('/create',isAuth, organisationController.create);

module.exports = router;