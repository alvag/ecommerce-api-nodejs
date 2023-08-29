import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { CustomError, RequestValidationError } from '../errors';
import { Error } from 'mongoose';

export const errorHandler: ErrorRequestHandler = ( error: Error, req: Request, res: Response, next: NextFunction ) => {
    console.log( `${ error.name }: ${ error.message }` );

    if ( error instanceof RequestValidationError ) {
        let { message, errors, statusCode } = error;
        return res.status( statusCode ).json( { message, errors, statusCode } );
    }

    if ( error instanceof CustomError ) {
        let { message, statusCode } = error;
        return res.status( statusCode ).json( { message, statusCode } );
    }

    if ( error instanceof Error.CastError ) {
        return res.status( 404 ).json( { message: 'Not found', statusCode: 404 } );
    }

    res.status( 500 ).json( {
        message: 'Internal server error',
        statusCode: 500,
        stack: error?.stack,
    } );
};
