import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import React from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { NewOrderRequest, RootState } from '../types'
import { useDispatch, useSelector } from 'react-redux'
import { useNewOrderMutation } from '../redux/api/order'
import { resetCart } from '../redux/reducer/cartReducer'
import { responseToast } from '../utils/feature'

const stripePromise = loadStripe(
  'pk_test_51PDl0RSEvYOc9i41lULHE3zBh4dAD48qwy3JsOFKCtnptROjdbsWL87KgAiBI8FrdEZg1cdo2VvCvB6lPEY8eZOS00vZpHn3GX'
)

const CheckoutForm = () => {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    cartItems,
    total,
    discount,
    shippingCharges,
    shippingInfo,
    subtotal,
    tax,
  } = useSelector((state: RootState) => state.cartReducer)

  const { user } = useSelector((state: RootState) => state.userReducer)

  const [isProcessing, setIsProcessing] = React.useState(false)

  const [newOrder] = useNewOrderMutation()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!stripe || !elements) return
    setIsProcessing(true)

    const orderInfo: NewOrderRequest = {
      orderItems: cartItems,
      total,
      discount,
      shippingCharges,
      shippingInfo,
      subtotal,
      tax,
      user: user?._id as string,
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
      redirect: 'if_required',
    })

    if (error) {
      setIsProcessing(false)
      return toast.error(error.message || 'Something went wrong with payment')
    }

    if (paymentIntent.status === 'succeeded') {
      const res = await newOrder(orderInfo)
      dispatch(resetCart())
      responseToast(res, navigate, '/orders')
    }

    setIsProcessing(false)
  }

  return (
    <div className="checkout-container">
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <button type="submit" disabled={isProcessing}>
          {isProcessing ? 'Processing' : 'Pay'}
        </button>
      </form>
    </div>
  )
}

const Checkout = () => {
  const location = useLocation()

  const clientSecret = location.state

  if (!clientSecret) return <Navigate to="/shipping" />

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
      }}
    >
      <CheckoutForm />
    </Elements>
  )
}

export default Checkout
