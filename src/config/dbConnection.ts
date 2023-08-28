import mongoose from 'mongoose';

export const dbConnection = async () => {
    try {
        const db = await mongoose.connect( `${ process.env.MONGODB_URL }`, {
            dbName: 'db_ecommerce',
        } );
        console.log( `Conectado a la base de datos: ${ db.connection.name }` );
    } catch ( error ) {
        throw error;
    }
};
