import { configureStore } from '@reduxjs/toolkit'
import { userApi } from './api/user'
import { userSlice } from './reducer/userReducer'

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [userSlice.name]: userSlice.reducer,
  },

  middleware: (defaultMiddleware) =>
    defaultMiddleware().concat(userApi.middleware),
})
