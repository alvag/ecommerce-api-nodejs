import { NextFunction, Request, Response } from 'express';
import { User } from '../models';
import { ForbiddenError, NotFoundError } from '../errors';


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
