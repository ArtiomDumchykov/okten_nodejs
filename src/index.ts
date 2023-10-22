// import * as fs from 'node:fs/promises';
// import * as path from 'node:path';

import * as bodyParser from "body-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import * as mongoose from "mongoose";
import * as swaggerUi from "swagger-ui-express";

import { configs } from "./config";
import { cronRunner } from "./crons";
import { authRouter, carRouter, homeRoutes, userRouter } from "./routes";
import { IError } from "./types";
import * as swaggerJson from "./utils/swagger.json";

const app = express();

app.use(cors());

const jsonParser = bodyParser.json();
const textParser = bodyParser.text();

app.use(jsonParser);
app.use(textParser);

app.use(express.urlencoded({ extended: true }));

app.use("/", homeRoutes);
app.use("/users", userRouter);
app.use("/cars", carRouter);
app.use("/auth", authRouter);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerJson));

app.use(
  (error: IError, req: Request, res: Response, next: NextFunction): void => {
    const status = error?.status || 500;

    res.status(status).json({
      message: error.message,
      status: error.status,
    });
  },
);

async function connection() {
  try {
    console.log("Connection Mongo");
    await mongoose.connect(configs.mongo.DB_URI);

    cronRunner();

    app.listen(configs.PORT, () => {
      console.log("Server is runnig...", configs.PORT);
    });
  } catch (error) {
    const err = error as Error;
    console.log(err);
  }
}

connection();
