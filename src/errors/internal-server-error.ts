import { CustomError } from './custom-error';

export class InternalServerError extends CustomError {
    statusCode = 500;

    constructor() {
        super( 'Internal server error' );
        Object.setPrototypeOf( this, InternalServerError.prototype );
    }

}
