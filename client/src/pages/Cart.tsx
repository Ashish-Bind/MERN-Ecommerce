import { useEffect, useState } from 'react'
import CartItem from '../components/CartItem'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { CartReducerInitialState } from '../types'
import {
  applyDiscount,
  calculatePayementInfo,
} from '../redux/reducer/cartReducer'
import axios from 'axios'
import { server } from '../redux/store'

const Cart = () => {
  const dispatch = useDispatch()
  const { cartItems, discount, subtotal, total, tax, shippingCharges } =
    useSelector(
      (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
    )

  const [coupon, setCoupon] = useState<string>('')
  const [isValidCoupon, setIsValidCoupon] = useState<boolean>(false)

  const navigate = useNavigate()

  useEffect(() => {
    const { cancel, token } = axios.CancelToken.source()
    const timeOut = setTimeout(() => {
      axios
        .get(`${server}api/v1/payment/discount?code=${coupon}`, {
          cancelToken: token,
        })
        .then((res) => {
          dispatch(applyDiscount(res.data.discount))
          dispatch(calculatePayementInfo())
          setIsValidCoupon(true)
        })
        .catch(() => {
          dispatch(applyDiscount(0))
          dispatch(calculatePayementInfo())
          setIsValidCoupon(false)
        })
    }, 100)

    return () => {
      clearTimeout(timeOut)
      cancel()
      setIsValidCoupon(false)
    }
  }, [coupon])

  useEffect(() => {
    dispatch(calculatePayementInfo())
  }, [cartItems])

  return (
    <div className="cart">
      <main>
        <h1>Cart</h1>
        <div className="cart-items">
          {cartItems.length > 0 ? (
            cartItems.map((item) => <CartItem key={item.name} {...item} />)
          ) : (
            <h1>No items added.</h1>
          )}
        </div>
      </main>
      <aside>
        <div>Subtotal: ₹{subtotal}</div>
        <div>Tax: ₹{tax}</div>
        <div>Shipping Charges: ₹{shippingCharges}</div>
        <div>
          <strong>Total: ₹{total}</strong>
        </div>

        <div>
          <input
            type="text"
            placeholder="Have a coupon?"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />
        </div>

        {coupon &&
          (isValidCoupon ? (
            <div className="green">
              ₹{discount} using the coupon {coupon}
            </div>
          ) : (
            <div className="red">Invalid Coupon</div>
          ))}
        <button onClick={() => navigate('/shipping')}>Checkout</button>
      </aside>
    </div>
  )
}

export default Cart
