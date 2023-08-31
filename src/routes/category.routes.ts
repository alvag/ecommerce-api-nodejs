import { Router } from 'express';
import { createCategory } from '../controllers';
import { isAdmin, isAuth, validateRequest } from '../middlewares';
import { body } from 'express-validator';

const router = Router();

router.post( '/', [
    body( 'name' ).not().isEmpty().withMessage( 'Name is required' ),
    validateRequest,
    isAuth, isAdmin,
], createCategory );

export default router;
