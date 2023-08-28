import { app } from './app';
import { dbConnection } from './config/dbConnection';

dbConnection().then( () => {
    const port = process.env.PORT || 3000;
    app.listen( port, () => {
        console.log( `Listening on port ${ port }!` );
    } );
} ).catch( ( err ) => {
    console.log( `Error al conectar a la base de datos: ${ err }` );
} );


