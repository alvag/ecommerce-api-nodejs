import { NextFunction, Request, Response } from 'express';
import { Product } from '../models';
import { NotFoundError } from '../errors';
import slugify from 'slugify';
import { QueryFilter } from '../helpers/query.helper';

export const createProduct = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const slug = slugify( req.body.slug || req.body.title, { lower: true } );
        const product = Product.build( { ...req.body, slug } );
        await product.save();

        res.status( 201 ).json( product );
    } catch ( error ) {
        next( error );
    }
};

export const getProductById = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const { id } = req.params;

        const product = await Product.findById( id )
            .populate( [ 'category', 'brand' ] );
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
        const products = await Product.find( QueryFilter.productQuery( req.query ) )
            .sort( QueryFilter.sortFilter( `${ req.query.sort || 'updatedAt,desc' }` ) )
            .select( '-sold' );
        res.json( products );
    } catch ( error ) {
        next( error );
    }
};

export const updateProduct = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const { id } = req.params;

        let product = await Product.findById( id );
        if ( !product ) {
            throw new NotFoundError( 'Product not found' );
        }

        product = await Product.findByIdAndUpdate( id, req.body, { new: true } );

        res.json( product );
    } catch ( error ) {
        next( error );
    }
};

export const deleteProduct = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const { id } = req.params;

        const product = await Product.findById( id );
        if ( !product ) {
            throw new NotFoundError( 'Product not found' );
        }

        await Product.findByIdAndDelete( id );

        res.json( { message: 'Product deleted successfully' } );
    } catch ( error ) {
        next( error );
    }
};
