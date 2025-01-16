import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err) {
    if (!err.status) {
      console.log(err);
      res.status(400).json({ msg: "something wrong here" });
    }
  }
  if (err.status) {
    console.log(err.status, err.msg, "<--err in handler");
    console.error(err);
    res.status(err.status).json({ msg: err.msg });
  } else {
    console.error(err);
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

export const wrongURLError = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.originalUrl) {
    console.log("Unmatched route triggered:", req.originalUrl);
    res.status(404).send({ msg: "The wrong URL path" });
  }
};
