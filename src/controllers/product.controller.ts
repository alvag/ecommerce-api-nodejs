import { NextFunction, Request, Response } from 'express';
import { Product } from '../models';
import { NotFoundError } from '../errors';
import slugify from 'slugify';
import { QueryFilter } from '../helpers/query.helper';
import { Pagination } from '../helpers/pagination.helper';

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
        const { perPage, page, fields = '' } = req.query;

        const _limit = Number.isNaN( parseInt( perPage as string ) ) || parseInt( perPage as string ) <= 0 ? 10 : parseInt( perPage as string );
        const _page = Number.isNaN( parseInt( page as string ) ) || parseInt( page as string ) <= 0 ? 1 : parseInt( page as string );

        const products = await Product.find( QueryFilter.productQuery( req.query ) )
            .sort( QueryFilter.sortFilter( `${ req.query.sort || 'updatedAt,desc' }` ) )
            .limit( _limit )
            .skip( ( _page - 1 ) * _limit )
            .select( fields ? fields.toString().split( ',' ) : '' );

        const totalProducts = await Product.countDocuments( QueryFilter.productQuery( req.query ) );

        res.json( {
            pagination: Pagination.paginate( _limit, _page, totalProducts, req ),
            products,
        } );
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
