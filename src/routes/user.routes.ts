import { Router } from 'express';
import { body, query } from 'express-validator';
import {
    changeStatus,
    deleteUserById,
    getUserById,
    getUsers,
    registerUser,
    signIn,
    updateUserById,
} from '../controllers/user.controller';
import { isAdmin, isAuth, validateRequest } from '../middlewares';

const router = Router();

router.get( '/', [ isAuth ], getUsers );

router.get( '/:id', [
        query( 'id' ).isMongoId().withMessage( 'Invalid id' ),
        validateRequest,
        isAuth,
    ],
    getUserById,
);

router.delete( '/:id', [
        query( 'id' ).isMongoId().withMessage( 'Invalid id' ),
        validateRequest,
        isAuth, isAdmin,
    ],
    deleteUserById,
);

router.patch( '/', [ isAuth ], updateUserById );

router.patch( '/change-status/:id', [
    query( 'id' ).isMongoId().withMessage( 'Invalid id' ),
    body( 'isActive' ).isBoolean().withMessage( 'isActive must be boolean' ),
    validateRequest,
    isAuth,
    isAdmin,
], changeStatus );

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


export default router;
