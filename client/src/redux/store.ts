import { configureStore } from '@reduxjs/toolkit'
import { userApi } from './api/user'
import { userSlice } from './reducer/userReducer'
import { productApi } from './api/product'
import { cartSlice } from './reducer/cartReducer'
import { orderApi } from './api/order'
import { statsApi } from './api/stats'

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [statsApi.reducerPath]: statsApi.reducer,
    [userSlice.name]: userSlice.reducer,
    [cartSlice.name]: cartSlice.reducer,
  },

  middleware: (defaultMiddleware) =>
    defaultMiddleware().concat([
      userApi.middleware,
      productApi.middleware,
      orderApi.middleware,
      statsApi.middleware,
    ]),
})

export const server = import.meta.env.VITE_SERVER

export type RootState = ReturnType<typeof store.getState>
