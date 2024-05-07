import { NextFunction, Request, Response } from 'express'
import { trycatch } from '../middlewares/error.js'
import { Coupon } from '../models/coupon.js'
import ErrorHandler from '../utils/utility-class.js'
import { stripe } from '../app.js'

export const newCoupon = trycatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { code, amount } = req.body

    if (!code || !amount)
      return next(new ErrorHandler('Please enter all fields', 400))

    await Coupon.create({ code, amount })

    res.status(201).json({
      success: true,
      message: `Coupon Created for ${code}`,
    })
  }
)

export const applyDiscount = trycatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.query

    const discount = await Coupon.findOne({ code })

    if (!discount) return next(new ErrorHandler('Invalid Coupon Code', 400))

    res.status(201).json({
      success: true,
      discount: discount.amount,
    })
  }
)

export const allCoupon = trycatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const coupons = await Coupon.find({})

    if (!coupons) return next(new ErrorHandler('No coupons Found', 400))

    res.status(201).json({
      success: true,
      coupons,
    })
  }
)

export const deletedCoupon = trycatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { couponId } = req.params

    const coupon = await Coupon.findByIdAndDelete(couponId)

    if (!coupon) return next(new ErrorHandler('No coupon Found', 400))

    res.status(201).json({
      success: true,
      message: `Coupon code ${coupon.code} deleted`,
    })
  }
)

export const createPaymentIntent = trycatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { amount } = req.body

    if (!amount) return next(new ErrorHandler('Please enter Amount', 400))

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount) * 100,
      currency: 'INR',
    })

    res.status(201).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    })
  }
)
