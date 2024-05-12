import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  BarChartResponse,
  DashboardResponse,
  LineChartResponse,
  PieChartResponse,
} from '../../types'

export const statsApi = createApi({
  reducerPath: 'statsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER_URL}/stats/`,
  }),
  tagTypes: ['stats'],
  endpoints: (builder) => ({
    dashboardStats: builder.query<DashboardResponse, string>({
      query: (adminId) => `dashboard?id=${adminId}`,
      providesTags: ['stats'],
      keepUnusedDataFor: 0,
    }),
    pie: builder.query<PieChartResponse, string>({
      query: (adminId) => `pie?id=${adminId}`,
      providesTags: ['stats'],
      keepUnusedDataFor: 0,
    }),
    bar: builder.query<BarChartResponse, string>({
      query: (adminId) => `bar?id=${adminId}`,
      providesTags: ['stats'],
      keepUnusedDataFor: 0,
    }),
    line: builder.query<LineChartResponse, string>({
      query: (adminId) => `line?id=${adminId}`,
      providesTags: ['stats'],
      keepUnusedDataFor: 0,
    }),
  }),
})

export const {
  useDashboardStatsQuery,
  usePieQuery,
  useLineQuery,
  useBarQuery,
} = statsApi
