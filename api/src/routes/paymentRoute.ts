import express from 'express'
import { adminOnly } from '../middlewares/auth.js'
import {
  allCoupon,
  applyDiscount,
  createPaymentIntent,
  deletedCoupon,
  newCoupon,
} from '../controllers/paymentController.js'

const router = express.Router()

router.post('/order', createPaymentIntent)
router.post('/coupon/new', adminOnly, newCoupon)
router.get('/discount', applyDiscount)
router.get('/coupon/all', adminOnly, allCoupon)
router.delete('/:couponId', adminOnly, deletedCoupon)

export default router
