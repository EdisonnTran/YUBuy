import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(cors)
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

console.log("Hello!")