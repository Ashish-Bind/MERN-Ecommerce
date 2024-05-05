import express from 'express'
import NodeCache from 'node-cache'
import morgan from 'morgan'
import userRoute from './routes/userRoute.js'
import productRoute from './routes/productRoute.js'
import orderRoute from './routes/orderRoute.js'
import { config } from 'dotenv'
import { errorMiddleware } from './middlewares/error.js'
import { connectDB } from './utils/feature.js'

config({ path: './.env' })

const port = process.env.PORT || 3000

const app = express()

export const myCache = new NodeCache()

connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.use('/uploads', express.static('uploads'))

app.use('/api/v1/user', userRoute)
app.use('/api/v1/product', productRoute)
app.use('/api/v1/order', orderRoute)

app.use(errorMiddleware)

app.listen(port, () => {
  console.log(`Server started at port ${port}`)
})
