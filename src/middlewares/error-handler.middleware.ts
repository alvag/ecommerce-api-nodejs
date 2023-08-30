import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { CustomError, RequestValidationError } from '../errors';
import { Error } from 'mongoose';

export const errorHandler: ErrorRequestHandler = ( error: Error, req: Request, res: Response, next: NextFunction ) => {
    console.log( `${ error.name }: ${ error.message }` );

    if ( error instanceof RequestValidationError ) {
        const { message, errors, statusCode } = error;
        return res.status( statusCode ).json( { message, errors, statusCode } );
    }

    if ( error instanceof CustomError ) {
        const { message, statusCode } = error;
        return res.status( statusCode ).json( { message, statusCode } );
    }

    if ( error instanceof Error.CastError ) {
        return res.status( 404 ).json( { message: 'Not found', statusCode: 404 } );
    }

    if ( error instanceof Error.ValidationError ) {
        const { message, stack, errors } = error;
        return res.status( 400 ).json( { message, stack, errors, statusCode: 400 } );
    }

    res.status( 500 ).json( {
        message: 'Internal server error',
        statusCode: 500,
        stack: error?.stack,
    } );
};
