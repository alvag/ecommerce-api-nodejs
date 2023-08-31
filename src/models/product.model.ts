import { Document, model, Model, Schema } from 'mongoose';
import { BadRequestError } from '../errors';
import slugify from 'slugify';

interface ProductAttrs {
    title: string;
    slug: string;
    description: string;
    price: number;
    category: string;
    quantity: number;
    images?: string[];
    color: string;
    ratings?: {
        star: number;
        postedBy: string;
    }[],
    brand: string;
    sold?: number;
}

interface ProductDocument extends Document {
    title: string;
    slug: string;
    description: string;
    price: number;
    category: string;
    quantity: number;
    images: string[];
    color: string;
    ratings: {
        star: number;
        postedBy: string;
    }[];
    brand: string;
    sold: number;
}

interface ProductModel extends Model<ProductDocument> {
    build( attrs: ProductAttrs ): ProductDocument;
}

const productSchema = new Schema( {
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    images: {
        type: Array,
    },
    color: {
        type: String,
        required: true,
    },
    ratings: [
        {
            star: Number,
            postedBy: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        },
    ],
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand',
        required: true,
    },
    sold: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
    versionKey: false,
    toJSON: {
        transform( doc, ret ) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
} );

productSchema.statics.build = ( attrs: ProductAttrs ) => {
    return new Product( attrs );
};

productSchema.pre( 'save', async function ( next ) {

    const product = await Product.exists( { slug: this.slug } );
    if ( product ) {
        throw new BadRequestError( 'Product slug is already in use' );
    }

    next();
} );

productSchema.pre( 'findOneAndUpdate', async function ( next ) {
    if ( this.get( 'slug' ) ) {
        const slug = slugify( this.get( 'slug' ), { lower: true } );
        const product = await Product.exists( { slug } );
        if ( product && product._id.toString() !== this.getQuery()._id ) {
            throw new BadRequestError( 'Product slug is already in use' );
        }

        this.set( 'slug', slug );
    }

    next();
} );

const Product = model<ProductDocument, ProductModel>( 'Product', productSchema );
export { Product };
