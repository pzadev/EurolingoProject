import { NextFunction, Request, Response } from "express";
import { fetchAllWord , fetchAllUsers } from "../models/app.models";


export const getApi = (req: Request, res: Response, next: NextFunction) => {
    res.send({ msg: 'hello' })
}

export const getAllWords = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language : string = req.params.language
        const words = await fetchAllWord(language)
        res.status(200).send(words)
    }
    catch(err){
        console.error(err)
    }
    
}

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await fetchAllUsers()
        res.status(200).send(users)
    }
    catch(err){
        console.error(err)
    }
}