import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import axios from 'axios'
import {
  AllUserResponse,
  DeleteUserRequest,
  MessageResponse,
  User,
  UserResponse,
} from '../../types'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER_URL}/user/`,
  }),
  tagTypes: ['users'],
  endpoints: (builder) => ({
    login: builder.mutation<MessageResponse, User>({
      query: (user) => ({ url: 'new', method: 'POST', body: user }),
      invalidatesTags: ['users'],
    }),
    allUsers: builder.query<AllUserResponse, string>({
      query: (adminId) => `all-users?id=${adminId}`,
      providesTags: ['users'],
    }),
    deleteUser: builder.mutation<MessageResponse, DeleteUserRequest>({
      query: ({ adminId, userId }) => ({
        url: `${userId}?id=${adminId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['users'],
    }),
  }),
})

export const getUserWithId = async (id: string) => {
  const { data }: { data: UserResponse } = await axios.get(
    `${import.meta.env.VITE_SERVER_URL}/user/${id}`
  )
  return data
}

export const { useLoginMutation, useDeleteUserMutation, useAllUsersQuery } =
  userApi
