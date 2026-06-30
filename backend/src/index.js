import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'

import { userExampleRouter } from './api/user_example/UserExampleRouter.js'
import { testRouter } from './api/test/apiTestCall.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.listen(process.env.PORT, () => {
    console.log(`Server running on port http://localhost:${process.env.PORT}`);
})

app.use('/users_example', userExampleRouter)
app.use('/test', testRouter)
export { app }