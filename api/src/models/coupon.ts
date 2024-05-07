import mongoose from 'mongoose'

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: [true, 'Please enter Coupon Code'],
  },
  amount: {
    type: Number,
    required: [true, 'Please enter Discount Amount'],
  },
})

export const Coupon = mongoose.model('Coupon', couponSchema)
