// import * as fs from 'node:fs/promises';
// import * as path from 'node:path';

import express from 'express';
import cors from 'cors';
import * as mongoose from 'mongoose';
import * as bodyParser  from 'body-parser';

import { configs } from './config';
import { carRouter, homeRoutes, userRouter }  from './routes';
import { Request, Response, NextFunction } from 'express';
import { IError } from './types';

const app = express();

app.use(cors())

const jsonParser = bodyParser.json();
const textParser = bodyParser.text(); 

app.use(jsonParser); 
app.use(textParser); 

app.use(express.urlencoded({extended: true}));

app.use('/', homeRoutes);
app.use('/users', userRouter)
app.use('/cars', carRouter)

app.use((error: IError, req: Request, res: Response, next: NextFunction): void => {
    const status = error?.status || 500;
    
    res.status(status).json(error.message)
}) 

async function connection() {
    try {
        console.log("Connection Mongo")
        await mongoose.connect(configs.mongo.DB_URI);

        app.listen(configs.PORT, () => {
            console.log('Server is runnig...', configs.PORT);
        })
    } catch (error) {
        const err = error as Error;
        console.log(err);
    }
}

connection();