import mongoose, { Document } from 'mongoose'
import { myCache } from '../app.js'
import { Product } from '../models/product.js'
import { InvalidateCache, OrderItems } from '../types.js'

export const connectDB = ({ url }: { url: string }) => {
  mongoose
    .connect(url, { dbName: 'ecommerce' })
    .then(() => console.log('Database connected'))
}

export const invalidateCache = ({
  product,
  admin,
  order,
  userId,
  orderId,
  productId,
}: InvalidateCache) => {
  if (product) {
    const options = ['latest-products', 'categories', 'all-products']

    productId?.map((id) => options.push(`product-${id}`))

    myCache.del(options)
  }

  if (admin) {
    const options = [
      'dashboard-stats',
      'line-chart-stats',
      'pie-chart-stats',
      'bar-chart-stats',
    ]

    myCache.del(options)
  }

  if (order) {
    const options = ['all-orders', `my-orders-${userId}`]

    orderId?.map((id) => options.push(`order-${id}`))

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

export const calculatePercentage = (
  currentMonth: number,
  lastMonth: number
) => {
  if (lastMonth === 0) return currentMonth * 100

  const percentage = (currentMonth / lastMonth) * 100
  return Number(percentage.toFixed(0))
}

export const getInventory = async (
  categories: string[],
  productCount: number
) => {
  const promise = categories.map((category) =>
    Product.countDocuments({ category })
  )

  const categoriesCount = await Promise.all(promise)

  const inventoryList: any = []

  categories.forEach((category, i) => {
    inventoryList.push({
      [category]: Math.round((categoriesCount[i] / productCount) * 100),
    })
  })

  return { inventoryList, categoriesCount }
}

interface MyDocument extends Document {
  createdAt: Date
  discount?: number
  total?: number
}

export const getPastAnalytics = ({
  length,
  document,
  today,
  property,
}: {
  length: number
  document: MyDocument[]
  today: Date
  property?: 'discount' | 'total'
}) => {
  const data: number[] = new Array(length).fill(0)

  document.forEach((i) => {
    const creationDate = i.createdAt
    const monthDifference =
      (today.getMonth() - creationDate.getMonth() + 12) % 12

    if (monthDifference < length) {
      if (!property) {
        data[length - monthDifference - 1] += 1
      } else {
        data[length - monthDifference - 1] += i[property]!
      }
    }
  })

  return data
}
