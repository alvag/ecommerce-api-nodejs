import jwt from 'jsonwebtoken';
import { NotAuthorizedError } from '../errors';

export class Jwt {
    static create( uid: string ) {
        return jwt.sign(
            {
                uid,
            },
            process.env.TOKEN_SECRET_KEY!,
            { expiresIn: process.env.TOKEN_EXPIRES },
        );
    }

    static verify( token: string ) {
        try {
            const payload = jwt.verify( token, process.env.TOKEN_SECRET_KEY! );
            return payload as { uid: string };
        } catch {
            throw new NotAuthorizedError();
        }
    }
}
