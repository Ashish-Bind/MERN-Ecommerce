import { configureStore } from '@reduxjs/toolkit'
import { userApi } from './api/user'
import { userSlice } from './reducer/userReducer'
import { productApi } from './api/product'

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [userSlice.name]: userSlice.reducer,
  },

  middleware: (defaultMiddleware) =>
    defaultMiddleware().concat([userApi.middleware, productApi.middleware]),
})

export const server = import.meta.env.VITE_SERVER
