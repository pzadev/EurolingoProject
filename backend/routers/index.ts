import express from 'express'
import { getApi, getAllWords } from '../controllers/app.controller'
import userRouter from './usersRouter'

const apiRouter = express.Router()

apiRouter.get('/', getApi)

apiRouter.get('/:language', getAllWords)

apiRouter.use('/users', userRouter )


export default apiRouter