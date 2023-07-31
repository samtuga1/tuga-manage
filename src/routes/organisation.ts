import { Router } from "express";

const retrieveSingleOrganisationController = require('../controllers/organisation/retrieve_single');
const createOrganisationController = require('../controllers/organisation/create');
const inviteMembersController = require('../controllers/organisation/invite_members');
const listOrganisationsController = require('../controllers/organisation/list_organisations');

const isAuth = require('../middlewares/is_auth');

const router = Router();

router.get('/retrieve',isAuth, listOrganisationsController);

router.get('/retrieve/:id',isAuth, retrieveSingleOrganisationController);

router.post('/create',isAuth, createOrganisationController);

router.patch('/:id/invite/members', isAuth, inviteMembersController);

module.exports = router;