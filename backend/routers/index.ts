import express from 'express'
import { getApi, getAllWords } from '../controllers/app.controller'

const apiRouter = express.Router()

apiRouter.get('/', getApi)

apiRouter.get('/:language', getAllWords)

export default apiRouter