import { NextFunction, Request, Response } from "express";
import mongoose, { ObjectId } from 'mongoose';
import { validationResult } from "express-validator";

import {Organisation} from '../models/organisation';
import {User} from '../models/user';

exports.retrieve = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try{
        const myOrganisations = await Organisation.find({members: {$in: req.userId}}).populate('members');
        res.status(200).json({
          organisations: myOrganisations,
        });  
    } catch(err) {
        next(err);
    }
};

exports.retrieveSingle = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {

        // retrieve organisation id from request body
        const {id} = req.params;
        if(!id) {
         const error = new Error('Organisation id is required') as ResponseError;
         error.statusCode = 400;
         throw error;
        }

        // convert the string id into an object id
        const objectId = new mongoose.Types.ObjectId(id);

        // find organisation from database
        const retrievedOrganisation = await Organisation.findById(objectId).populate('members');

        // handle error when organisation is not found
        if(!retrievedOrganisation) {
        const error = new Error('Could not find organisation') as ResponseError;
         error.statusCode = 400;
         throw error;
        }

        res.status(200).json(retrievedOrganisation);

    } catch(err) {
        console.log(err);
        next(err);
    }
}

exports.create = async (req: CustomRequest, res: Response, next: NextFunction) => {
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

exports.inviteMembers = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try{

        const {id} = req.params;
        const {memberIds} = req.body;

        if((memberIds as Array<any>).length === 0) {
            const error = new Error('Member list cannot be empty') as ResponseError;
            error.statusCode = 400;
            throw error; 
        };

        if(!mongoose.Types.ObjectId.isValid(id)) {
            const error = new Error('Invalid organisation id') as ResponseError;
            error.statusCode = 400;
            throw error;
        }

         // find the organisation associated with the id
         const organisation = await Organisation.findById(id);

          // throw error if organisation was not found
        if(!organisation) {
            const error = new Error('Organisation was not found') as ResponseError;
            error.statusCode = 404;
            throw error;
        }

        for(var memberId in memberIds) {
            if(!mongoose.Types.ObjectId.isValid(memberId)) {
                const error = new Error('Member ids list contains invalid data') as ResponseError;
            error.statusCode = 404;
            throw error;
            }
        }

        const members = await User.find({_id: {$in: memberIds}});

        organisation.members.push(...members);

        await organisation.populate('members');

        res.status(200).json(organisation);

    } catch(err) {
        next(err);
    }
    
}