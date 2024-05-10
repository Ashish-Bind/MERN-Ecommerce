import { createSlice } from '@reduxjs/toolkit'
import { User, UserReducerInitialState } from '../../types'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState: UserReducerInitialState = {
  user: null,
  loading: true,
}

export const userSlice = createSlice({
  name: 'userReducer',
  initialState,
  reducers: {
    userExist: (state, action: PayloadAction<User>) => {
      state.loading = false
      state.user = action.payload
    },
    noUserExist: (state) => {
      state.loading = false
      state.user = null
    },
  },
})

export const { noUserExist, userExist } = userSlice.actions
