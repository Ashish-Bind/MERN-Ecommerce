import { config } from 'dotenv'
import express, { urlencoded } from 'express'
import morgan from 'morgan'
import NodeCache from 'node-cache'
import { errorMiddleware } from './middlewares/error.js'
import orderRoute from './routes/orderRoute.js'
import paymentRoute from './routes/paymentRoute.js'
import productRoute from './routes/productRoute.js'
import statsRoute from './routes/statsRoute.js'
import userRoute from './routes/userRoute.js'
import { connectDB } from './utils/feature.js'
import Stripe from 'stripe'

config({ path: './.env' })

const port = process.env.PORT || 3000
const mongoURI = process.env.MONGO_URL || ''
const stripeKey = process.env.STRIPE_KEY || ''

const app = express()

export const stripe = new Stripe(stripeKey)
export const myCache = new NodeCache()

connectDB({ url: mongoURI })

app.use(urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan('dev'))

app.use('/uploads', express.static('uploads'))

app.use('/api/v1/user', userRoute)
app.use('/api/v1/product', productRoute)
app.use('/api/v1/order', orderRoute)
app.use('/api/v1/payment', paymentRoute)
app.use('/api/v1/stats', statsRoute)

app.use(errorMiddleware)

app.listen(port, () => {
  console.log(`Server started at port ${port}`)
})
