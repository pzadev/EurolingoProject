import { NextFunction, Request, Response } from "express";
import {
  fetchAllWord,
  fetchAllUsers,
  fetchUserByUsername,
  postUser,
  UserBody,
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
    res.status(200).json(words);
  } catch (err) {
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
    next(err);
  }
};

export const addNewUser = async (
  req: Request<{}, {}, UserBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const newUser = await postUser(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};
