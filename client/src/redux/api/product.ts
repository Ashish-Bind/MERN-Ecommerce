import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  AllProductResponse,
  CategoriesResponse,
  DeleteProductRequest,
  LatestProductResponse,
  MessageResponse,
  NewProductRequest,
  SearchProductQuery,
  SearchProductResponse,
  SingleProductResponse,
  UpdateProductRequest,
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
    singleProduct: builder.query<SingleProductResponse, string>({
      query: (productId) => productId,
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
    updateProduct: builder.mutation<MessageResponse, UpdateProductRequest>({
      query: ({ formData, adminId, productId }) => ({
        url: `${productId}?id=${adminId}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['products'],
    }),
    deleteProduct: builder.mutation<MessageResponse, DeleteProductRequest>({
      query: ({ adminId, productId }) => ({
        url: `${productId}?id=${adminId}`,
        method: 'DELETE',
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
  useSingleProductQuery,
  useNewProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi
