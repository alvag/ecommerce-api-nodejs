import { Router } from 'express';
import { createProduct, getProductById, getProducts } from '../controllers';
import { validateRequest } from '../middlewares';
import { body } from 'express-validator';

const router = Router();

router.get( '/', getProducts );

router.post( '/', [
    body( 'title' ).trim().notEmpty().withMessage( 'Title is required' ),
    body( 'slug' ).trim().notEmpty().withMessage( 'Slug is required' ),
    body( 'description' ).trim().notEmpty().withMessage( 'Description is required' ),
    body( 'price' ).trim().notEmpty().withMessage( 'Price is required' ),
    body( 'quantity' ).trim().notEmpty().withMessage( 'Quantity is required' ),
    validateRequest,
    // isAuth, isAdmin,
], createProduct );

router.get( '/:id', getProductById );

export default router;
