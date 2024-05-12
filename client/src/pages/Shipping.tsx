import React, { useEffect, useState } from 'react'
import { BiArrowBack } from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CartReducerInitialState } from '../types'
import axios from 'axios'
import toast from 'react-hot-toast'
import { saveShippingInfo } from '../redux/reducer/cartReducer'

const Shipping = () => {
  const { cartItems, total } = useSelector(
    (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
  )
  const [shippingDetails, setShippingDetails] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
  })

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const changeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShippingDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    dispatch(saveShippingInfo(shippingDetails))

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/payment/order`,
        { amount: total },
        { headers: { 'Content-type': 'application/json' } }
      )

      console.log(data)

      navigate('/checkout/pay', { state: data.clientSecret })
    } catch (e) {
      toast.error('Something went wrong')
    }
  }

  useEffect(() => {
    if (cartItems.length < 1) {
      return navigate('/')
    }
  }, [cartItems])

  return (
    <div className="shipping">
      <div className="back">
        <button onClick={() => navigate('/cart')}>
          <BiArrowBack />
        </button>
      </div>

      <div className="shipping-details">
        <h1>Shipping Address</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={shippingDetails.address}
            onChange={changeHandler}
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={shippingDetails.city}
            onChange={changeHandler}
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={shippingDetails.state}
            onChange={changeHandler}
          />
          <select
            title="Select Country"
            name="country"
            value={shippingDetails.country}
            onChange={changeHandler}
          >
            <option value="">Select Country</option>
            <option value="india">India</option>
            <option value="bangladesh">Bangladesh</option>
            <option value="nepal">Nepal</option>
          </select>
          <input
            type="number"
            name="pincode"
            placeholder="Pincode"
            value={shippingDetails.pincode}
            onChange={changeHandler}
          />
          <button>Continue to Payment</button>
        </form>
      </div>
    </div>
  )
}

export default Shipping
