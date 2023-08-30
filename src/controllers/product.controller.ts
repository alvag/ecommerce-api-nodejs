import { NextFunction, Request, Response } from 'express';
import { Product } from '../models';
import { NotFoundError } from '../errors';

export const createProduct = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const product = Product.build( req.body );
        await product.save();

        res.status( 201 ).json( product );
    } catch ( error ) {
        next( error );
    }
};

export const getProductById = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const { id } = req.params;

        const product = await Product.findById( id );
        if ( !product ) {
            throw new NotFoundError( 'Product not found' );
        }

        res.json( product );
    } catch ( error ) {
        next( error );
    }
};

export const getProducts = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const products = await Product.find();
        res.json( products );
    } catch ( error ) {
        next( error );
    }
};
