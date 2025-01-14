import express from 'express'
import { getApi, getAllWords, getAllUsers } from '../controllers/app.controller'

const apiRouter = express.Router()

apiRouter.get('/', getApi)

apiRouter.get('/:language', getAllWords)

apiRouter.get('/users', getAllUsers)

export default apiRouter