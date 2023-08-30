import { Document, model, Model, Schema } from 'mongoose';
import { Brand, Color } from '../enums';
import { BadRequestError } from '../errors';

interface ProductAttrs {
    title: string;
    slug: string;
    description: string;
    price: number;
    category: string;
    quantity: number;
    images?: string[];
    color?: string;
    ratings?: {
        star: number;
        postedBy: string;
    }[],
    brand?: string;
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
        enum: Object.values( Color ),
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
        type: String,
        enum: Object.values( Brand ),
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
    this.slug = this.slug.split( ' ' ).join( '-' );
    const product = await Product.exists( { slug: this.slug } );
    if ( product ) {
        throw new BadRequestError( 'Product slug is already in use' );
    }

    next();
} );

const Product = model<ProductDocument, ProductModel>( 'Product', productSchema );
export { Product };
