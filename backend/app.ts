import express, { Application } from "express";
import apiRouter from "./routers";
import {
  italianWords,
  frenchWords,
  germanWords,
  spanishWords,
  urkainianWords,
} from "./data/devData/index";
import { errorHandler } from "./errorHandler"

const app: Application = express();
app.use(express.json());
app.use("/api", apiRouter);

apiRouter.use(errorHandler)

export default app;
