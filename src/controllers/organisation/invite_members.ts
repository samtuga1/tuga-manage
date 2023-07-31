import { NextFunction, Request, Response } from "express";
import mongoose from 'mongoose';
import {Organisation} from '../../models/organisation';
import {User} from '../../models/user';

module.exports = async (req: CustomRequest, res: Response, next: NextFunction) => {
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