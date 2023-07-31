import { NextFunction, Request, Response } from "express";
import {Organisation} from '../../models/organisation';

module.exports = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try{
        const myOrganisations = await Organisation.find({members: {$in: req.userId}}).populate('members');
        res.status(200).json({
          organisations: myOrganisations,
        });  
    } catch(err) {
        next(err);
    }
};