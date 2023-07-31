import { NextFunction, Response } from "express";
import mongoose from 'mongoose';

import {Organisation} from '../../models/organisation';

module.exports = async (req: CustomRequest, res: Response, next: NextFunction) => {
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