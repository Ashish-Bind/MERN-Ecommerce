export interface User {
  name: string
  email: string
  gender: string
  _id: string
  photo: string
  role: string
  dob: string
}

export interface Product {
  name: string
  price: number
  stock: number
  category: string
  _id: string
  photo: string
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

export type NewProductRequest = {
  adminId: string
  formData: FormData
}

/* Reducer Types */

export interface UserReducerInitialState {
  user: User | null
  loading: boolean
}
