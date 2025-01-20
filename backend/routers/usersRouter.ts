import { Router } from "express";
import {
  getAllUsers,
  getUserByUsername,
  addNewUser,
  patchUserProgress
} from "../controllers/app.controller";

const userRouter: Router = Router();

userRouter.get("/", getAllUsers);

userRouter.get("/:username", getUserByUsername);

userRouter.post("/", addNewUser);

userRouter.patch("/:username", patchUserProgress)

export default userRouter;
