import { NextFunction, Request, Response } from 'express';
import { Brand } from '../models';

export const createBrand = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const brand = Brand.build( req.body );
        await brand.save();

        res.status( 201 ).json( brand );
    } catch ( error ) {
        next( error );
    }
};
