import { NextFunction, Request, Response } from 'express'
import { myCache } from '../app.js'
import { trycatch } from '../middlewares/error.js'
import { Order } from '../models/orders.js'
import { Product } from '../models/product.js'
import { User } from '../models/user.js'
import {
  calculatePercentage,
  getInventory,
  getPastAnalytics,
} from '../utils/feature.js'

export const getDashboardStats = trycatch(
  async (req: Request, res: Response, next: NextFunction) => {
    let stats

    const key = 'dashboard-stats'

    if (!myCache.has(key)) {
      const today = new Date()
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

      const currentMonth = {
        start: new Date(today.getFullYear(), today.getMonth(), 1),
        end: today,
      }

      const lastMonth = {
        start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        end: new Date(today.getFullYear(), today.getMonth(), 0),
      }

      const [
        currentMonthProducts,
        lastMonthProducts,
        currentMonthUsers,
        lastMonthUsers,
        currentMonthOrders,
        lastMonthOrders,
        productCount,
        userCount,
        allOrders,
        lastSixMonthsOrders,
        categories,
        femaleCount,
        latestTransations,
      ] = await Promise.all([
        Product.find({
          createdAt: {
            $gte: currentMonth.start,
            $lte: currentMonth.end,
          },
        }),
        Product.find({
          createdAt: {
            $gte: lastMonth.start,
            $lte: lastMonth.end,
          },
        }),
        User.find({
          createdAt: {
            $gte: currentMonth.start,
            $lte: currentMonth.end,
          },
        }),
        User.find({
          createdAt: {
            $gte: lastMonth.start,
            $lte: lastMonth.end,
          },
        }),
        Order.find({
          createdAt: {
            $gte: currentMonth.start,
            $lte: currentMonth.end,
          },
        }),
        Order.find({
          createdAt: {
            $gte: lastMonth.start,
            $lte: lastMonth.end,
          },
        }),
        Product.countDocuments(),
        User.countDocuments(),
        Order.find({}).select('total'),
        Order.find({
          createdAt: {
            $gte: sixMonthsAgo,
            $lte: currentMonth.end,
          },
        }),
        Product.distinct('category'),
        User.countDocuments({ gender: 'female' }),
        Order.find({})
          .select(['discount', 'total', 'status', 'orderItems'])
          .limit(4),
      ])

      const totalRevenue = allOrders.reduce(
        (total, order) => total + (order.total || 0),
        0
      )

      const currentMonthRevenue = currentMonthOrders.reduce(
        (total, order) => total + (order.total || 0),
        0
      )

      const lastMonthRevenue = lastMonthOrders.reduce(
        (total, order) => total + (order.total || 0),
        0
      )

      const orderMonthCounts = getPastAnalytics({
        length: 6,
        document: lastSixMonthsOrders,
        today,
      })

      const orderMonthlyRevenue = getPastAnalytics({
        length: 6,
        document: lastSixMonthsOrders,
        today,
        property: 'total',
      })

      const { inventoryList } = await getInventory(categories, productCount)

      const charts = {
        order: orderMonthCounts,
        revenue: orderMonthlyRevenue,
      }

      const percentages = {
        user: calculatePercentage(
          currentMonthUsers.length,
          lastMonthUsers.length
        ),
        product: calculatePercentage(
          currentMonthProducts.length,
          lastMonthProducts.length
        ),
        order: calculatePercentage(
          currentMonthOrders.length,
          lastMonthOrders.length
        ),
        revenue: calculatePercentage(currentMonthRevenue, lastMonthRevenue),
      }

      const counts = {
        user: userCount,
        product: productCount,
        order: allOrders.length,
        revenue: totalRevenue,
      }

      const ratio = {
        male: userCount - femaleCount,
        female: femaleCount,
      }

      const modifiedLatestTransation = latestTransations.map(
        ({ _id, discount, total, status, orderItems }) => ({
          _id,
          discount,
          total,
          status,
          quantity: orderItems.length,
        })
      )

      stats = {
        percentages,
        counts,
        charts,
        inventory: inventoryList,
        ratio,
        latest: modifiedLatestTransation,
      }

      myCache.set(key, JSON.stringify(stats))
    } else {
      stats = JSON.parse(myCache.get(key)!)
    }

    res.status(201).json({ success: true, stats })
  }
)

export const getLineChartStats = trycatch(
  async (req: Request, res: Response, next: NextFunction) => {
    let line

    const key = 'line-chart-stats'

    if (!myCache.has(key)) {
      const today = new Date()
      const twelveMonthsAgo = new Date()
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

      const query = {
        createdAt: {
          $gte: twelveMonthsAgo,
          $lte: today,
        },
      }

      const [products, orders, users] = await Promise.all([
        Product.find(query).select('createdAt'),
        Order.find(query).select(['createdAt', 'total', 'discount']),
        User.find(query).select('createdAt'),
      ])

      const productsCount = getPastAnalytics({
        length: 12,
        today,
        document: products,
      })

      const usersCount = getPastAnalytics({
        length: 12,
        today,
        document: users,
      })

      const discount = getPastAnalytics({
        length: 12,
        today,
        document: orders,
        property: 'discount',
      })

      const revenue = getPastAnalytics({
        length: 12,
        today,
        document: orders,
        property: 'total',
      })

      line = {
        product: productsCount,
        user: usersCount,
        discount,
        revenue,
      }

      myCache.set(key, JSON.stringify(line))
    } else {
      line = JSON.parse(myCache.get(key)!)
    }

    res.status(201).json({ success: true, line })
  }
)

export const getPieChartStats = trycatch(
  async (req: Request, res: Response, next: NextFunction) => {
    let pie

    const key = 'pie-chart-stats'

    if (!myCache.has(key)) {
      const [
        processingOrders,
        shippedOrders,
        deliveredOrders,
        categories,
        productCount,
        outOfStock,
        allOrders,
        allUsers,
      ] = await Promise.all([
        Order.countDocuments({ status: 'Processing' }),
        Order.countDocuments({ status: 'Shipped' }),
        Order.countDocuments({ status: 'Delivered' }),
        Product.distinct('category'),
        Product.countDocuments({}),
        Product.countDocuments({ stock: 0 }),
        Order.find({}).select(['total', 'shippingCharges', 'tax', 'discount']),
        User.find({}).select(['role', 'dob']),
      ])

      const { inventoryList } = await getInventory(categories, productCount)

      const grossIncome = allOrders.reduce(
        (acc, order) => acc + (order.total || 0),
        0
      )

      const discount = allOrders.reduce(
        (acc, order) => acc + (order.discount || 0),
        0
      )

      const productionCost = allOrders.reduce(
        (acc, order) => acc + (order.shippingCharges || 0),
        0
      )

      const burnt = allOrders.reduce((acc, order) => acc + (order.tax || 0), 0)

      const marketingCost = Math.round(grossIncome * (30 / 100))

      const netMargin =
        grossIncome - discount - productionCost - burnt - marketingCost

      let admin = 0
      let userRole = 0

      allUsers.forEach((user) => {
        user.role === 'admin' ? (admin += 1) : (userRole += 1)
      })

      const ageGroup = {
        teen: allUsers.filter((user) => user.age <= 20).length,
        adult: allUsers.filter((user) => user.age > 20 && user.age <= 40)
          .length,
        old: allUsers.filter((user) => user.age >= 40).length,
      }

      const role = {
        admin,
        user: userRole,
      }

      const stock = {
        inStock: productCount - outOfStock,
        outOfStock,
      }

      const revenueDistribution = {
        netMargin,
        discount,
        productionCost,
        burnt,
        marketingCost,
      }

      pie = {
        processingOrders,
        shippedOrders,
        deliveredOrders,
        inventory: inventoryList,
        stock,
        revenueDistribution,
        role,
        ageGroup,
      }

      myCache.set(key, JSON.stringify(pie))
    } else {
      pie = JSON.parse(myCache.get(key)!)
    }

    res.status(201).json({ success: true, pie })
  }
)

export const getBarChartStats = trycatch(
  async (req: Request, res: Response, next: NextFunction) => {
    let bar

    const key = 'bar-chart-stats'

    if (!myCache.has(key)) {
      const today = new Date()
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      const twelveMonthsAgo = new Date()
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

      const [products, users, orders] = await Promise.all([
        Product.find({
          createdAt: {
            $gte: sixMonthsAgo,
            $lte: today,
          },
        }).select('createdAt'),
        Order.find({
          createdAt: {
            $gte: sixMonthsAgo,
            $lte: today,
          },
        }).select('createdAt'),
        User.find({
          createdAt: {
            $gte: twelveMonthsAgo,
            $lte: today,
          },
        }).select('createdAt'),
      ])

      const productsCount = getPastAnalytics({
        length: 6,
        today,
        document: products,
      })

      const usersCount = getPastAnalytics({
        length: 6,
        today,
        document: users,
      })

      const ordersCount = getPastAnalytics({
        length: 12,
        today,
        document: orders,
      })

      bar = {
        product: productsCount,
        user: usersCount,
        order: ordersCount,
      }

      myCache.set(key, JSON.stringify(bar))
    } else {
      bar = JSON.parse(myCache.get(key)!)
    }

    res.status(201).json({ success: true, bar })
  }
)
