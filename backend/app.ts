import express, { Application } from "express";
import apiRouter from "./routers";
import {
  italianWords,
  frenchWords,
  germanWords,
  spanishWords,
  urkainianWords,
} from "./data/devData/index";

const app: Application = express();
app.use(express.json());
app.use("/api", apiRouter);

export default app;
