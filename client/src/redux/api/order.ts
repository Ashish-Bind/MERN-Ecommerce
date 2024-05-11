import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  AllOrderResponse,
  DeleteOrderRequest,
  MessageResponse,
  MyOrderResponse,
  NewOrderRequest,
  SingleOrderQuery,
  SingleOrderResponse,
  UpdateOrderRequest,
} from '../../types'

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER_URL}/order/`,
  }),
  tagTypes: ['orders'],
  endpoints: (builder) => ({
    newOrder: builder.mutation<MessageResponse, NewOrderRequest>({
      query: (order) => ({ url: 'new', method: 'POST', body: order }),
      invalidatesTags: ['orders'],
    }),
    updateOrder: builder.mutation<MessageResponse, UpdateOrderRequest>({
      query: ({ adminId, orderId }) => ({
        url: `${orderId}?id=${adminId}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['orders'],
    }),
    deleteOrder: builder.mutation<MessageResponse, DeleteOrderRequest>({
      query: ({ adminId, orderId }) => ({
        url: `${orderId}?id=${adminId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['orders'],
    }),
    orderWithId: builder.query<MyOrderResponse, string>({
      query: (userId) => `my-orders?id=${userId}`,
      providesTags: ['orders'],
    }),
    allOrders: builder.query<AllOrderResponse, string>({
      query: (adminId) => `all?id=${adminId}`,
      providesTags: ['orders'],
    }),
    singleOrder: builder.query<SingleOrderResponse, SingleOrderQuery>({
      query: ({ adminId, orderId }) => `${orderId}?id=${adminId}`,
      providesTags: ['orders'],
    }),
  }),
})

export const {
  useAllOrdersQuery,
  useOrderWithIdQuery,
  useSingleOrderQuery,
  useNewOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderApi
