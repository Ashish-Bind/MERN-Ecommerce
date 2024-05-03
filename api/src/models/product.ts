import mongoose from 'mongoose'

interface ProductType {
  name: string
  photo: string
  price: number
  stock: number
  category: string
  createdAt: Date
  updatedAt: Date
}

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter Name'],
    },
    photo: {
      type: String,
      required: [true, 'Please enter Photo'],
    },
    price: {
      type: Number,
      required: [true, 'Please enter Price'],
    },
    stock: {
      type: Number,
      required: [true, 'Please enter Stock'],
    },
    category: {
      type: String,
      required: [true, 'Please enter Stock'],
      trim: true,
    },
  },
  { timestamps: true }
)

export const Product = mongoose.model<ProductType>('Product', productSchema)
