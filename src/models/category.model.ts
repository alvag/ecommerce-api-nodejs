import { Document, model, Model, Schema } from 'mongoose';
import slugify from 'slugify';
import { BadRequestError } from '../errors';

interface CategoryAttrs {
    name: string;
    slug?: string;
    image?: string;
    description?: string;
}

interface CategoryDocument extends Document {
    name: string;
    slug: string;
    image: string;
    description: string;
}

interface CategoryModel extends Model<CategoryDocument> {
    build( attrs: CategoryAttrs ): CategoryDocument;
}

const categorySchema = new Schema( {
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

categorySchema.statics.build = ( attrs: CategoryAttrs ) => {
    return new Category( attrs );
};

categorySchema.pre( 'save', async function ( next ) {
    this.slug = slugify( this.slug || this.name, { lower: true } );

    const category = await Category.findOne( { slug: this.slug } );
    if ( category ) {
        throw new BadRequestError( 'Category slug is already in use' );
    }

    next();
} );

const Category = model<CategoryDocument, CategoryModel>( 'Category', categorySchema );
export { Category };
