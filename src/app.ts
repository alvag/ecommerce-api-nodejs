import dotenv from 'dotenv';
import express, { Request } from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares';
import { NotFoundError } from './errors';
import appRoutes from './routes';

dotenv.config();

const app = express();
app.use( express.json() );

app.use( '/api', appRoutes );

app.all( '*', ( req: Request, res ) => {
    throw new NotFoundError( `Not found: ${ req.originalUrl }` );
} );

app.use( errorHandler );


app.use( cors() );


export { app };
