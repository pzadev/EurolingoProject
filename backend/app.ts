import express, { Application } from "express";
import cors from "cors";
import apiRouter from "./routers";
import {
  italianWords,
  frenchWords,
  germanWords,
  spanishWords,
  urkainianWords,
} from "./data/devData/index";
import { errorHandler, wrongURLError } from "./errorHandler";

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

app.get("*", wrongURLError);

app.use(errorHandler);

export default app;
