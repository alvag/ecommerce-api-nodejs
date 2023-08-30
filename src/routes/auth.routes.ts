import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares';
import { refreshToken, registerUser, signIn, singOut } from '../controllers';

const router = Router();

router.post( '/register', [
    body( 'email' ).isEmail().withMessage( 'Email must be valid' ),
    body( 'password' ).trim().isLength( {
        min: 4,
        max: 20,
    } ).withMessage( 'Password must be between 4 and 20 characters' ),
    body( 'firstName' ).trim().notEmpty().withMessage( 'First name is required' ),
    body( 'lastName' ).trim().notEmpty().withMessage( 'Last name is required' ),
    body( 'mobile' ).trim().notEmpty().withMessage( 'Mobile is required' ),
    validateRequest,
], registerUser );

router.post( '/login',
    [
        body( 'email' ).isEmail().withMessage( 'Email must be valid' ),
        body( 'password' ).trim().isLength( {
            min: 4,
            max: 20,
        } ).withMessage( 'Password must be between 4 and 20 characters' ),
        validateRequest,
    ],
    signIn,
);

router.get( '/logout', singOut );

router.get( '/refresh-token', refreshToken );

export default router;
