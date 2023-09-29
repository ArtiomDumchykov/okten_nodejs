// import * as fs from 'node:fs/promises';
// import * as path from 'node:path';

import express from 'express';
import cors from 'cors'
import * as mongoose from 'mongoose';
import * as bodyParser  from 'body-parser';

import { configs } from './config';
import  { homeRoutes }  from './routes';

const app = express();

app.use(cors());

const jsonParser = bodyParser.json();
const textParser = bodyParser.text(); 

app.use(jsonParser); 
app.use(textParser); 

app.use(express.urlencoded({extended: true}));

app.use('/', homeRoutes);

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