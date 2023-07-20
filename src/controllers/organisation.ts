import { NextFunction, Request, Response } from "express";

import {Organisation} from '../models/organisation';

exports.retrieve = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try{
        const myOrganisations = await Organisation.find({members: {$in: req.userId}});
        res.status(200).json({
          organisations: myOrganisations,
        });  
    } catch(err) {
        next(err);
    }
 
};

exports.create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {name} = req.body;
        if(!name) {
            const error = new Error('Name is required') as ResponseError;
            error.statusCode = 400;
            throw error;
        }
    
        const organisation = new Organisation({
            name: name,
        });
    const result = await organisation.save();
    
    res.status(201).json(result);
    } catch(err) {
        next(err);
    }
};