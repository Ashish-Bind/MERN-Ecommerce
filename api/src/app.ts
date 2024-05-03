import express, { urlencoded } from 'express'
import userRoute from './routes/userRoute.js'
import productRoute from './routes/productRoute.js'
import { errorMiddleware } from './middlewares/error.js'
import { connectDB } from './utils/feature.js'

const port = 3000

const app = express()

connectDB()

app.use(express.json())
app.use(urlencoded({ extended: true }))

app.use('/uploads', express.static('uploads'))

app.use('/api/v1/user', userRoute)
app.use('/api/v1/product', productRoute)

app.use(errorMiddleware)

app.listen(port, () => {
  console.log(`Server started at port ${port}`)
})
