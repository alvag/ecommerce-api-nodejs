import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config();

const app = express();
app.use( express.json() );

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    exposedHeaders: [ 'set-cookie' ],
};

app.use( cors( corsOptions ) );
app.options( '*', cors( corsOptions ) );


export { app };
