import { NextFunction, Request, Response } from 'express';
import { ForbiddenError } from '../errors';
import { Role } from '../enums';

export const isAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { role } = req.user;

        if ( role !== Role.ADMIN ) {
            throw new ForbiddenError();
        }

        next();
    } catch ( error ) {
        next( error );
    }
};
