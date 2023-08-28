import { CustomError } from './custom-error';

export class DatabaseConnectionError extends CustomError {

    constructor(
        public message = 'Error connecting to database',
        public statusCode = 500 ) {
        super( message );

        Object.setPrototypeOf( this, DatabaseConnectionError.prototype );
    }

}
