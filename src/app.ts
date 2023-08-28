import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares';
import { NotFoundError } from './errors';

dotenv.config();

const app = express();
app.use( express.json() );

app.get( '/', ( req, res ) => {
    res.send( 'Hello World!' );
} );

app.all( '*', ( req, res ) => {
    throw new NotFoundError();
} );

app.use( errorHandler );


app.use( cors() );


export { app };
