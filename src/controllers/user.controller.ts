import { NextFunction, Request, Response } from 'express';
import { User } from '../models';
import { BadRequestError, ForbiddenError, NotFoundError } from '../errors';

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
        const users = await User.find( { isActive: true } );
        res.json( users );
    } catch ( error ) {
        next( error );
    }
};

export const getUserById = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const { id } = req.params;
        const user = await User.findOne( { _id: id, isActive: true } );

        if ( !user ) {
            throw new NotFoundError( 'User not found' );
        }

        res.json( user );
    } catch ( error ) {
        next( error );
    }
};

export const deleteUserById = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const { id } = req.params;
        const { uid } = req.user;

        if ( id === uid ) {
            throw new ForbiddenError();
        }

        const user = await User.findById( id );

        if ( !user ) {
            throw new NotFoundError( 'User not found' );
        }

        await User.findByIdAndDelete( id );

        res.json( { message: 'User deleted successfully' } );

    } catch ( error ) {
        next( error );
    }
};

export const updateUserById = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const { uid: id } = req.user;

        const { email, password, firstName, lastName, mobile } = req.body;

        let user = await User.findOne( { _id: id, isActive: true } );

        if ( !user ) {
            throw new NotFoundError( 'User not found' );
        }

        user = await User.findByIdAndUpdate( id, { id, email, password, firstName, lastName, mobile }, { new: true } );

        return res.json( user );

    } catch ( error ) {
        next( error );
    }
};

export const changeStatus = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const { id } = req.params;
        const { uid } = req.user;
        const { isActive } = req.body;

        if ( id === uid ) {
            throw new ForbiddenError();
        }

        let user = await User.findById( id );

        if ( !user ) {
            throw new NotFoundError( 'User not found' );
        }

        user = await User.findByIdAndUpdate( id, { isActive }, { new: true } );

        return res.json( user );
    } catch ( error ) {
        next( error );
    }
};
