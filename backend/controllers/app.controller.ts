import { NextFunction, Request, Response } from "express";
import {
  fetchAllWord,
  fetchAllUsers,
  fetchUserByUsername,
  postUser,
  User,
} from "../models/app.models";

export const getApi = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ msg: "hello" });
  } catch (err) {
    next(err);
  }
};

export const getAllWords = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const language: string = req.params.language;
    const words = await fetchAllWord(language);
    console.log(JSON.stringify(words));
    res.status(200).json(words);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await fetchAllUsers();
    res.status(200).send(users);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getUserByUsername = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userParam: string = req.params.username;
    const user = await fetchUserByUsername(userParam);
    res.status(200).send(user);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const addNewUser = async (
  req: Request<{}, {}, User>,
  res: Response,
  next: NextFunction
) => {
  try {
    const newUser = await postUser(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    next(err);
  }
};
