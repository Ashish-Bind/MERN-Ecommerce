import express from 'express'
import userRoute from './routes/userRoute.js'
import { errorMiddleware } from './middlewares/error.js'
import { connectDB } from './utils/feature.js'

const port = 3000

const app = express()

connectDB()

app.use(express.json())

app.use('/api/v1/user', userRoute)

app.use(errorMiddleware)

app.listen(port, () => {
  console.log(`Server started at port ${port}`)
})
