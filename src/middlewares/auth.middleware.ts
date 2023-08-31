import { NextFunction, Request, Response } from 'express';
import { Jwt } from '../helpers';
import { NotAuthorizedError } from '../errors';
import { User } from '../models';

export const isAuth = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const token = req.get( 'Authorization' )?.split( ' ' )[ 1 ];

        if ( !token ) {
            throw new NotAuthorizedError();
        }

        const { uid } = Jwt.verify( token );

        const user = await User.findOne( { _id: uid, isActive: true } );

        if ( !user ) {
            throw new NotAuthorizedError();
        }

        req.user = { uid, email: user.email, role: user.role };

        next();
    } catch ( error ) {
        next( error );
    }
};
