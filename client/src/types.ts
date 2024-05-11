export type User = {
  name: string
  email: string
  gender: string
  _id: string
  photo: string
  role: string
  dob: string
}

export type Product = {
  name: string
  price: number
  stock: number
  category: string
  _id: string
  photo: string
}

export type ShippingInfo = {
  address: string
  city: string
  state: string
  country: string
  pincode: string
}

export type CartItem = {
  productId: string
  photo: string
  name: string
  price: number
  quantity: number
  stock: number
}

export type OrderItem = Omit<CartItem, 'stock'> & { _id: string }

export type Order = {
  orderItems: OrderItem[]
  shippingInfo: ShippingInfo
  _id: string
  status: string
  user: {
    _id: string
    name: string
    email: string
  }
  subtotal: number
  tax: number
  shippingCharges: number
  discount: number
  total: number
}

export type MyOrder = Omit<Order, 'user'> & { user: string }

/* API Types */

export type ErrorResponse = {
  status: number
  data: { success: boolean; message: string }
}

export type MessageResponse = {
  success: boolean
  message: string
}

export type UserResponse = {
  success: boolean
  user: User
}

export type LatestProductResponse = {
  success: boolean
  products: Product[]
}

export type AllProductResponse = {
  success: boolean
  products: Product[]
}

export type CategoriesResponse = {
  success: boolean
  categories: string[]
}

export type AllOrderResponse = {
  success: boolean
  orders: Order[]
}

export type MyOrderResponse = {
  success: boolean
  orders: MyOrder[]
}

export type SingleOrderResponse = {
  success: boolean
  order: Order
}

export type SearchProductResponse = AllProductResponse & {
  totalpage: number
}

export type SearchProductQuery = {
  search: string
  category: string
  price: number
  sort: string
  page: number
}

export type SingleOrderQuery = { adminId: string; orderId: string }

export type NewProductRequest = {
  adminId: string
  formData: FormData
}

export type UpdateProductRequest = NewProductRequest & {
  productId: string
}

export type SingleProductResponse = {
  success: boolean
  product: Product
}

export type DeleteProductRequest = {
  adminId: string
  productId: string
}

export type NewOrderRequest = {
  shippingInfo: ShippingInfo
  user: string
  subtotal: number
  tax: number
  shippingCharges: number
  discount: number
  total: number
  orderItems: CartItem[]
}

export type UpdateOrderRequest = {
  orderId: string
  adminId: string
}

export type DeleteOrderRequest = UpdateOrderRequest

/* Reducer Types */

export interface UserReducerInitialState {
  user: User | null
  loading: boolean
}

export interface CartReducerInitialState {
  loading: boolean
  cartItems: CartItem[]
  subtotal: number
  shippingCharges: number
  discount: number
  total: number
  tax: number
  shippingInfo: ShippingInfo
}

export interface RootState {
  userReducer: UserReducerInitialState
  cartReducer: CartReducerInitialState
}
