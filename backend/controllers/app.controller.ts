import { NextFunction, Request, Response } from "express";


export const getApi = (req: Request, res: Response, next: NextFunction) => {
    res.send({ msg: 'hello' })
}