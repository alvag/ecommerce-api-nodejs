import { NextFunction, Request, Response } from 'express';
import { User } from '../models';
import { BadRequestError, NotAuthorizedError } from '../errors';
import { Jwt } from '../helpers';

export const registerUser = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const { email, password, firstName, lastName, mobile } = req.body;
        const user = User.build( { email, password, firstName, lastName, mobile } );
        await user.save();

        res.status( 201 ).json( user );
    } catch ( e ) {
        next( e );
    }
};

export const signIn = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne( { email } );
        if ( !user ) {
            throw new BadRequestError( 'Invalid credentials' );
        }

        const isMatch = await user.isPasswordMatched( password );
        if ( !isMatch ) {
            throw new BadRequestError( 'Invalid credentials' );
        }

        if ( !user.isActive ) {
            throw new BadRequestError( 'User is not active' );
        }

        const refreshToken = user.generateToken( '1d' );
        res.cookie( 'refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24, //1d
            secure: true,
        } );

        return res.json( {
            user,
            token: user.generateToken(),
        } );


    } catch ( error ) {
        next( error );
    }
};

export const singOut = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        res.clearCookie( 'refreshToken', {
            httpOnly: true,
            secure: true,
        } );
        res.json( { message: 'User signed out successfully' } );
    } catch ( error ) {
        next( error );
    }
};
export const refreshToken = async ( req: Request, res: Response, next: NextFunction ) => {
    try {

        let { refreshToken } = req.cookies;

        if ( !refreshToken ) {
            throw new NotAuthorizedError();
        }

        const { uid } = Jwt.verify( refreshToken );

        const user = await User.findById( uid );

        if ( !user ) {
            throw new NotAuthorizedError();
        }

        refreshToken = user.generateToken( '1d' );
        const token = user.generateToken();

        res.cookie( 'refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24, //1d
            secure: true,
        } );

        res.json( { token } );

    } catch ( error ) {
        next( error );
    }
};
