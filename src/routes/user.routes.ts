import { Router } from 'express';
import { body, query } from 'express-validator';
import { changeStatus, deleteUserById, getUserById, getUsers, updateUserById } from '../controllers/user.controller';
import { isAdmin, validateRequest } from '../middlewares';

const router = Router();

router.get( '/', getUsers );

router.get( '/:id', [
        query( 'id' ).isMongoId().withMessage( 'Invalid id' ),
        validateRequest,
    ],
    getUserById,
);

router.delete( '/:id', [
        query( 'id' ).isMongoId().withMessage( 'Invalid id' ),
        validateRequest,
        isAdmin,
    ],
    deleteUserById,
);

router.patch( '/', updateUserById );

router.patch( '/change-status/:id', [
    query( 'id' ).isMongoId().withMessage( 'Invalid id' ),
    body( 'isActive' ).isBoolean().withMessage( 'isActive must be boolean' ),
    validateRequest,
    isAdmin,
], changeStatus );


export default router;
