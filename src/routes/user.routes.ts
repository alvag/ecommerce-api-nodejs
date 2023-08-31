import { Router } from 'express';
import { body, param } from 'express-validator';
import { changeStatus, deleteUserById, getUserById, getUsers, updateUserById } from '../controllers';
import { isAdmin, validateRequest } from '../middlewares';

const router = Router();

router.get( '/', getUsers );

router.get( '/:id', [
        param( 'id' ).isMongoId().withMessage( 'Invalid id' ),
        validateRequest,
    ],
    getUserById,
);

router.delete( '/:id', [
        param( 'id' ).isMongoId().withMessage( 'Invalid id' ),
        validateRequest,
        isAdmin,
    ],
    deleteUserById,
);

router.patch( '/', updateUserById );

router.patch( '/change-status/:id', [
    param( 'id' ).isMongoId().withMessage( 'Invalid id' ),
    body( 'isActive' ).isBoolean().withMessage( 'isActive must be boolean' ),
    validateRequest,
    isAdmin,
], changeStatus );


export default router;
