import { NextFunction, Request, Response } from 'express'

export type Controller = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>

export type FilterOptions = {
  search?: string
  category?: string
  price?: number
  sort?: string
  page?: number
}

export interface BaseQuery {
  name?: {
    $regex: string
    $options: string
  }
  price?: {
    $lte: number
  }
  category?: string
}

export type InvalidateCache = {
  product?: boolean
  admin?: boolean
  order?: boolean
  userId?: string
  orderId?: string[]
  productId?: string[]
}

export type ShippingInfo = {
  address: string
  city: string
  state: string
  country: string
  pincode: number
}

export type OrderItems = {
  name: string
  photo: string
  price: number
  quantity: number
  productId: string
}

export interface OrderRequestBody {
  shippingInfo: ShippingInfo
  user: string
  subtotal: number
  tax: number
  shippingCharges: number
  discount: number
  total: number
  status: 'Processing' | 'Shipped' | 'Delivered'
  orderItems: OrderItems[]
}
