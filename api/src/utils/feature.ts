import mongoose from 'mongoose'
import { InvalidateCache, OrderItems } from '../types.js'
import { Product } from '../models/product.js'
import { myCache } from '../app.js'
import { Order } from '../models/orders.js'

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URL!, { dbName: 'ecommerce' })
    .then(() => console.log('Database connected'))
}

export const invalidateCache = async ({
  product,
  admin,
  order,
  userId,
}: InvalidateCache) => {
  if (product) {
    const options = ['latest-products', 'categories', 'all-products']

    const products = await Product.find({}).select('_id')

    products.map(({ _id }) => {
      options.push(`product-${_id}`)
    })

    myCache.del(options)
  }

  if (admin) {
  }

  if (order) {
    const options = ['all-orders']

    const orders = await Order.find({}).select('_id')

    orders.map(({ _id }) => {
      options.push(`order-${_id}`)
      options.push(`my-orders-${userId}`)
    })

    myCache.del(options)
  }
}

export const reduceStock = (orderItems: OrderItems[]) => {
  orderItems.forEach(async (value) => {
    const productId = value.productId
    const product = await Product.findById(productId)

    if (!product) return new Error('Product not found')

    product.stock -= value.quantity

    await product.save()
  })
}
