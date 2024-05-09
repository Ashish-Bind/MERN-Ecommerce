import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import { createApi } from '@reduxjs/toolkit/query/react'
import { MessageResponse, User } from '../../types'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER_URL}/user/`,
  }),
  endpoints: (builder) => {
    return {
      login: builder.mutation<MessageResponse, User>({
        query: (user) => {
          return { url: 'new', method: 'POST', body: user }
        },
      }),
    }
  },
})

export const { useLoginMutation } = userApi
