import { NextFunction, Request, Response } from 'express';
import { Category } from '../models';

export const createCategory = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const category = Category.build( req.body );
        await category.save();

        res.status( 201 ).json( category );
    } catch ( error ) {
        next( error );
    }
};
