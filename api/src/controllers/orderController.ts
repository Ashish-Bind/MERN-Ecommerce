import { Request, Response, NextFunction } from 'express'
import { trycatch } from '../middlewares/error.js'
import { OrderRequestBody } from '../types.js'
import { Order } from '../models/orders.js'
import { invalidateCache, reduceStock } from '../utils/feature.js'
import ErrorHandler from '../utils/utility-class.js'
import { myCache } from '../app.js'

export const newOrder = trycatch(
  async (
    req: Request<{}, {}, OrderRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const {
      shippingInfo,
      discount,
      orderItems,
      shippingCharges,
      subtotal,
      tax,
      total,
      user,
    } = req.body

    console.log({
      shippingInfo,
      discount,
      orderItems,
      shippingCharges,
      subtotal,
      tax,
      total,
      user,
    })

    if (
      !shippingInfo ??
      !discount ??
      !orderItems ??
      !shippingCharges ??
      !subtotal ??
      !tax ??
      !total ??
      !user
    ) {
      return next(new ErrorHandler('Please enter all field', 400))
    }

    await Order.create({
      shippingInfo,
      discount,
      orderItems,
      shippingCharges,
      subtotal,
      tax,
      total,
      user,
    })

    reduceStock(orderItems)

    invalidateCache({ product: true, admin: true, order: true, userId: user })

    res.status(201).json({
      success: true,
      message: `Order created`,
    })
  }
)

export const myOrders = trycatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query

    const key = `my-orders-${id}`

    let orders

    if (!myCache.has(key)) {
      orders = await Order.find({ user: id })
      myCache.set(key, JSON.stringify(orders))
    } else {
      orders = JSON.parse(myCache.get(key)!)
    }

    res.status(200).json({
      success: true,
      orders,
    })
  }
)

export const allOrders = trycatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const key = 'all-orders'

    let orders

    if (!myCache.has(key)) {
      orders = await Order.find({}).populate('user', 'name email')
      myCache.set(key, JSON.stringify(orders))
    } else {
      orders = JSON.parse(myCache.get(key)!)
    }

    res.status(200).json({
      success: true,
      orders,
    })
  }
)

export const singleOrder = trycatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    const key = `order-${id}`

    let order

    if (!myCache.has(key)) {
      order = await Order.findById(id).populate('user', 'name email')
      if (!order) return next(new ErrorHandler('Order not found', 404))
      myCache.set(key, JSON.stringify(order))
    } else {
      order = JSON.parse(myCache.get(key)!)
    }

    res.status(200).json({
      success: true,
      order,
    })
  }
)

export const updateStatus = trycatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    const order = await Order.findById(id)

    if (!order) return next(new ErrorHandler('Invalid Order Id', 400))

    switch (order.status) {
      case 'Processing':
        order.status = 'Shipped'
        break
      case 'Shipped':
        order.status = 'Delivered'
        break
      default:
        order.status = 'Delivered'
        break
    }

    await order.save()

    await invalidateCache({
      product: true,
      admin: true,
      order: true,
      userId: order.user!,
    })

    res.status(201).json({
      success: true,
      message: `Order updated`,
    })
  }
)

export const deleteOrder = trycatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    const order = await Order.findById(id)

    if (!order) return next(new ErrorHandler('Invalid Order Id', 400))

    await order.deleteOne()

    await invalidateCache({
      product: true,
      admin: true,
      order: true,
      userId: order.user!,
    })

    res.status(201).json({
      success: true,
      message: `Order Deleted with id ${id}`,
    })
  }
)
