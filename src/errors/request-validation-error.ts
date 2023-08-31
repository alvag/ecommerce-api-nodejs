import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

interface ValidationErrorInterface {
    message: string;
    field?: string;
}

export class RequestValidationError extends CustomError {
    errors: ValidationErrorInterface[] = [];

    constructor(
        public validationErrors: ValidationError[],
        public message = 'Invalid request parameters',
        public statusCode = 400 ) {
        super( message );
        this.errors = this.serializeErrors();
        this.message = this.errors[ 0 ]?.message || this.message;
        Object.setPrototypeOf( this, RequestValidationError.prototype );
    }

    private serializeErrors(): ValidationErrorInterface[] {
        try {
            return this.validationErrors.map( ( err ) => ( {
                message: err.msg,
                field: err.type === 'field' ? err.path : '',
            } ) );
        } catch ( e ) {
            return [];
        }
    }
}
