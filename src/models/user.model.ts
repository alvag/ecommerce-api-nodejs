import { Document, model, Model, Schema } from 'mongoose';
import { BadRequestError } from '../errors';
import { Jwt, Password } from '../helpers';
import { Role } from '../enums';

interface UserAttrs {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    mobile: string;
    isActive?: boolean;
    role?: string;
}

interface UserDocument extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    mobile: string;
    isActive: boolean;
    role: string;

    isPasswordMatched( password: string ): Promise<boolean>;

    generateToken( expiresIn?: string ): string;
}

interface UserModel extends Model<UserDocument> {
    build( attrs: UserAttrs ): UserDocument;
}

const userSchema = new Schema( {
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: Role.USER,
        enum: Object.values( Role ),
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    cart: {
        type: Array,
        default: [],
    },
    address: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Address',
        },
    ],
    wishList: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product',
        },
    ],
}, {
    timestamps: true,
    versionKey: false,
    toJSON: {
        transform( doc, rec ) {
            rec.id = rec._id;
            delete rec._id;
            delete rec.password;
        },
    },
} );

userSchema.statics.build = ( attrs: UserAttrs ) => {
    return new User( attrs );
};

userSchema.methods.isPasswordMatched = async function ( password: string ) {
    return await Password.compare( this.password, password );
};

userSchema.methods.generateToken = function ( expiresIn?: string ) {
    return Jwt.create( this._id, expiresIn );
};

userSchema.pre( 'save', async function ( next ) {
    let user = await User.exists( { email: this.email } );
    if ( user ) {
        throw new BadRequestError( 'Email is already in use' );
    }

    user = await User.exists( { mobile: this.mobile } );
    if ( user ) {
        throw new BadRequestError( 'Mobile number is already in use' );
    }

    if ( this.isModified( 'password' ) ) {
        this.password = await Password.hash( this.password );
    }

    next();
} );

userSchema.pre( 'findOneAndUpdate', async function ( next ) {
    if ( this.get( 'email' ) ) {
        const user = await User.findOne( { email: this.get( 'email' ) } );

        if ( user && user._id.toString() !== this.get( 'id' ) ) {
            throw new BadRequestError( 'Email is already in use' );
        }
    }

    if ( this.get( 'mobile' ) ) {
        const user = await User.findOne( { mobile: this.get( 'mobile' ) } );
        if ( user && user._id.toString() !== this.get( 'id' ) ) {
            throw new BadRequestError( 'Mobile number is already in use' );
        }
    }

    if ( this.get( 'password' ) ) {
        this.set( 'password', await Password.hash( this.get( 'password' ) ) );
    }
    next();
} );

const User = model<UserDocument, UserModel>( 'User', userSchema );
export { User };
