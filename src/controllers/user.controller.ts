import { NextFunction, Request, Response } from 'express';
import { User } from '../models';
import { BadRequestError } from '../errors';

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

        return res.json( {
            user,
            token: user.generateToken(),
        } );


    } catch ( error ) {
        next( error );
    }
};

export const getUsers = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const users = await User.find();
        res.json( users );
    } catch ( error ) {
        next( error );
    }
};


export const getUserById = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const { id } = req.params;
        const user = await User.findById( id );

        if ( !user ) {
            throw new BadRequestError( 'User not found' );
        }

        res.json( user );
    } catch ( error ) {
        next( error );
    }
};

export const deleteUserById = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const { id } = req.params;
        const user = await User.findById( id );

        if ( !user ) {
            throw new BadRequestError( 'User not found' );
        }

        await User.findByIdAndDelete( id );

        res.json( { message: 'User deleted successfully' } );

    } catch ( error ) {
        next( error );
    }
};
