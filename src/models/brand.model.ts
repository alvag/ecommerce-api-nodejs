import { Document, model, Model, Schema } from 'mongoose';
import slugify from 'slugify';
import { BadRequestError } from '../errors';

interface BrandAttrs {
    name: string;
    slug?: string;
    image?: string;
    description?: string;
}

interface BrandDocument extends Document {
    name: string;
    slug: string;
    image: string;
    description: string;
}

interface BrandModel extends Model<BrandDocument> {
    build( attrs: BrandAttrs ): BrandDocument;
}

const brandSchema = new Schema( {
    name: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
    },
    image: {
        type: String,
    },
    description: {
        type: String,
    },
}, {
    timestamps: true,
    versionKey: false,
    toJSON: {
        transform( doc, ret ) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.createdAt;
            delete ret.updatedAt;
        },
    },
} );

brandSchema.statics.build = ( attrs: BrandAttrs ) => {
    return new Brand( attrs );
};

brandSchema.pre( 'save', async function ( next ) {
    this.slug = slugify( this.slug || this.name, { lower: true } );

    const brand = await Brand.findOne( { slug: this.slug } );
    if ( brand ) {
        throw new BadRequestError( 'Brand slug is already in use' );
    }

    next();
} );

const Brand = model<BrandDocument, BrandModel>( 'Brand', brandSchema );
export { Brand };
