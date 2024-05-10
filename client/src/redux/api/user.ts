import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { MessageResponse, User, UserResponse } from '../../types'
import axios from 'axios'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER_URL}/user/`,
  }),
  endpoints: (builder) => ({
    login: builder.mutation<MessageResponse, User>({
      query: (user) => ({ url: 'new', method: 'POST', body: user }),
    }),
  }),
})

export const getUserWithId = async (id: string) => {
  const { data }: { data: UserResponse } = await axios.get(
    `${import.meta.env.VITE_SERVER_URL}/user/${id}`
  )
  return data
}

export const { useLoginMutation } = userApi
