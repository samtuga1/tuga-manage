import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import {Organisation} from '../../models/organisation';
import {User} from '../../models/user';

module.exports = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {

        const validationErrors = validationResult(req);
        if(!validationErrors.isEmpty) {
            const error = new Error('Validation error') as ResponseError;
            error.statusCode = 400;
            error.data = validationErrors.array();
            throw error;
        }

        // retrieve name from organisation body
        const {name} = req.body;

        // handle error when name is missing from body
        if(!name) {
            const error = new Error('Name is required') as ResponseError;
            error.statusCode = 400;
            throw error;
        }

        // create the organisation
        const organisation = new Organisation({
            name: name,
        });

        // current the current user
        const currentUser = await User.findById(req.userId);

        // set creator id to the current userid
        organisation.creatorId = currentUser._id;

        // add the current user to the members of this organisation
        organisation.members.push(currentUser);

        // save the organisation
        const result = await organisation.save();
    
        res.status(201).json(result);

    } catch(err) {
        next(err);
    }
};