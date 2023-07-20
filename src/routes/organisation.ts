import { Router } from "express";

import { check } from "express-validator";

const organisationController = require('../controllers/organisation');
const isAuth = require('../middlewares/is_auth');

const router = Router();

router.get('/retrieve',isAuth, organisationController.retrieve);

router.get('/retrieve/single/:id',isAuth, organisationController.retrieveSingle);

router.post('/create',isAuth, organisationController.create);

router.patch('/:id/invite/members', isAuth, organisationController.inviteMembers);

module.exports = router;