import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { InternalServerError, UnauthorizedError } from '../errors';

export class Jwt {
    static create( id: string, email: string ) {
        return jwt.sign(
            {
                id,
                email,
            },
            process.env.TOKEN_SECRET_KEY!,
            { expiresIn: process.env.TOKEN_EXPIRES },
        );
    }

    static verify( token: string ) {
        try {
            const payload = jwt.verify( token, process.env.TOKEN_SECRET_KEY! );
            return payload as { id: string, email: string };
        } catch ( error ) {
            if ( error instanceof TokenExpiredError ) {
                throw new UnauthorizedError();
            }
            throw new InternalServerError();
        }
    }
}
