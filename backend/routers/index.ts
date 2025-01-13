import express from 'express'
import { getApi } from '../controllers/app.controller'

const apiRouter = express.Router()

apiRouter.get('/', getApi)

export default apiRouter