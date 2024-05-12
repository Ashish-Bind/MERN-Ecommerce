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

export type Bar = {
  product: number[]
  user: number[]
  order: number[]
}

export type Line = {
  product: number[]
  user: number[]
  discount: number[]
  revenue: number[]
}

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

export type AllUserResponse = {
  success: boolean
  users: User[]
}

export type SingleUserResponse = {
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

export type DeleteUserRequest = {
  userId: string
  adminId: string
}

export type DeleteOrderRequest = UpdateOrderRequest

export type DashboardResponse = {
  success: boolean
  stats: {
    percentages: {
      user: number
      product: number
      order: number
      revenue: number
    }
    counts: {
      user: number
      product: number
      order: number
      revenue: number
    }
    charts: {
      order: number[]
      revenue: number[]
    }
    inventory: Record<string, number>[]
    ratio: {
      male: number
      female: number
    }
    latest: [
      {
        _id: string
        discount: number
        total: number
        status: string
        quantity: number
      }
    ]
  }
}

export type PieChartResponse = {
  success: true
  pie: {
    processingOrders: number
    shippedOrders: number
    deliveredOrders: number
    inventory: Record<string, number>[]
    stock: {
      inStock: number
      outOfStock: number
    }
    revenueDistribution: {
      netMargin: number
      discount: number
      productionCost: number
      burnt: number
      marketingCost: number
    }
    role: {
      admin: number
      user: number
    }
    ageGroup: {
      teen: number
      adult: number
      old: number
    }
  }
}

export type LineChartResponse = {
  success: boolean
  line: Line
}

export type BarChartResponse = {
  success: boolean
  bar: Bar
}

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
