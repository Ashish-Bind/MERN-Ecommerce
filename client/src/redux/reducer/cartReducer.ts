import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CartItem, CartReducerInitialState, ShippingInfo } from '../../types'

const initialState: CartReducerInitialState = {
  loading: false,
  cartItems: [],
  subtotal: 0,
  tax: 0,
  discount: 0,
  shippingCharges: 0,
  total: 0,
  shippingInfo: {
    address: '',
    city: '',
    pincode: '',
    country: '',
    state: '',
  },
}

export const cartSlice = createSlice({
  name: 'cartReducer',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.loading = true
      const idx = state.cartItems.findIndex(
        (i) => i.productId === action.payload.productId
      )

      if (idx !== -1) state.cartItems[idx] = action.payload
      else state.cartItems = [...state.cartItems, action.payload]

      state.loading = false
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.loading = true
      state.cartItems = state.cartItems.filter(
        (i) => i.productId !== action.payload
      )
      state.loading = false
    },
    calculatePayementInfo: (state) => {
      state.subtotal = state.cartItems.reduce(
        (acc, i) => (acc += i.price * i.quantity),
        0
      )

      state.shippingCharges = state.subtotal > 1000 ? 0 : 50
      state.tax = Math.round(0.18 * state.subtotal)
      state.total =
        state.shippingCharges + state.subtotal - state.discount + state.tax
    },
    applyDiscount: (state, action: PayloadAction<number>) => {
      state.discount = action.payload
    },
    saveShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
      state.shippingInfo = action.payload
    },
    resetCart: () => {
      initialState
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  calculatePayementInfo,
  applyDiscount,
  resetCart,
  saveShippingInfo,
} = cartSlice.actions
