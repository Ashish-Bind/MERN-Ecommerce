import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  AllProductResponse,
  CategoriesResponse,
  LatestProductResponse,
  MessageResponse,
  NewProductRequest,
  SearchProductQuery,
  SearchProductResponse,
} from '../../types'

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER_URL}/product/`,
  }),
  tagTypes: ['products'],
  endpoints: (builder) => ({
    latestProducts: builder.query<LatestProductResponse, string>({
      query: () => 'latest',
      providesTags: ['products'],
    }),
    adminProducts: builder.query<AllProductResponse, string>({
      query: (id) => `admin-products?id=${id}`,
      providesTags: ['products'],
    }),
    allCategories: builder.query<CategoriesResponse, string>({
      query: () => `all-categories`,
      providesTags: ['products'],
    }),
    searchProducts: builder.query<SearchProductResponse, SearchProductQuery>({
      query: ({ search, category, price, sort, page }) => {
        let base = `all-products?search=${search}&page=${page}`

        if (price) base += `&price=${price}`
        if (sort) base += `&sort=${sort}`
        if (category) base += `&category=${category}`

        return base
      },
      providesTags: ['products'],
    }),
    newProduct: builder.mutation<MessageResponse, NewProductRequest>({
      query: ({ formData, adminId }) => ({
        url: `new?id=${adminId}`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['products'],
    }),
  }),
})

export const {
  useLatestProductsQuery,
  useAdminProductsQuery,
  useAllCategoriesQuery,
  useSearchProductsQuery,
  useNewProductMutation,
} = productApi
