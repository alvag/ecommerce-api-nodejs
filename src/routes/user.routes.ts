import { Router } from 'express';
import { body } from 'express-validator';
import {
    deleteUserById,
    getUserById,
    getUsers,
    registerUser,
    signIn,
    updateUserById,
} from '../controllers/user.controller';
import { validateRequest } from '../middlewares';

const router = Router();

router.get( '/', getUsers );

router.get( '/:id', getUserById );

router.delete( '/:id', deleteUserById );

router.patch( '/:id', updateUserById );

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
    signIn );


export default router;
