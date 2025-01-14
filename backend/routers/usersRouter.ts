import { Router } from "express";
import { getAllUsers , getUserByUsername, addNewUser } from "../controllers/app.controller";

const userRouter: Router = Router()

userRouter.get('/', getAllUsers)

userRouter.get('/:username', getUserByUsername)

userRouter.post('/', addNewUser)

export default userRouter