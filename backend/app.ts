import 'dotenv/config'
import express from 'express'
import apiRouter from './routers'
import  { italianWords, frenchWords, germanWords, spanishWords, urkainianWords } from './data/devData/index'
import { seeding } from './database/seeding'
import { testFrenchWords, testGermanWords, testItalianWords, testSpanishWords, testUrkainianWords } from './data/testData/index'

const app = express()
const port: number = 8080

app.use('/api', apiRouter)

const bootstrap = async() => {
    // await seeding( italianWords, frenchWords, germanWords, spanishWords, urkainianWords )
    await seeding( testFrenchWords, testGermanWords, testItalianWords, testSpanishWords, testUrkainianWords )
}

app.listen(port, () => {
    console.log('listening on port 8080')
})

bootstrap()