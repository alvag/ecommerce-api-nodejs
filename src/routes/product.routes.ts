import { Router } from 'express';
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from '../controllers';
import { isAdmin, isAuth, validateRequest } from '../middlewares';
import { body, param } from 'express-validator';

const router = Router();

router.get( '/', getProducts );

router.post( '/', [
    body( 'title' ).trim().notEmpty().withMessage( 'Title is required' ),
    body( 'description' ).trim().notEmpty().withMessage( 'Description is required' ),
    body( 'price' ).trim().notEmpty().withMessage( 'Price is required' ),
    body( 'quantity' ).trim().notEmpty().withMessage( 'Quantity is required' ),
    body( 'color' ).trim().notEmpty().withMessage( 'Color is required' ),
    body( 'brand' )
        .trim().notEmpty().withMessage( 'Brand is required' )
        .isMongoId().withMessage( 'Invalid brand id' ),
    body( 'category' ).trim()
        .notEmpty().withMessage( 'Category is required' )
        .isMongoId().withMessage( 'Invalid category id' ),
    validateRequest,
    isAuth, isAdmin,
], createProduct );

router.get( '/:id', [
        param( 'id' ).isMongoId().withMessage( 'Invalid id' ),
        validateRequest,
    ],
    getProductById );

router.delete( '/:id', [
        param( 'id' ).isMongoId().withMessage( 'Invalid id' ),
        validateRequest,
        isAuth, isAdmin,
    ],
    deleteProduct );

router.patch( '/:id', [
    param( 'id' ).isMongoId().withMessage( 'Invalid id' ),
    body( 'brand' ).optional()
        .isMongoId().withMessage( 'Invalid brand id' ),
    body( 'category' ).optional()
        .isMongoId().withMessage( 'Invalid category id' ),
    validateRequest,
    isAuth, isAdmin,
], updateProduct );

export default router;
