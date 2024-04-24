import { useEffect, useState } from 'react'
import CartItem from '../components/CartItem'
import { Navigate, useNavigate } from 'react-router-dom'

const cartItems = [
  {
    id: '1',
    name: 'Iphone',
    img: 'https://m.media-amazon.com/images/I/71d7rfSl0wL._AC_UY327_FMwebp_QL65_.jpg',
    price: 65500,
    stock: 10,
    quantity: 2,
  },
  {
    id: '1',
    name: 'Iphone',
    img: 'https://m.media-amazon.com/images/I/71d7rfSl0wL._AC_UY327_FMwebp_QL65_.jpg',
    price: 65500,
    stock: 10,
    quantity: 2,
  },
]
const discount = 500

const Cart = () => {
  const [coupon, setCoupon] = useState<string>('')
  const [isValidCoupon, setIsValidCoupon] = useState<boolean>(false)

  const navigate = useNavigate()

  useEffect(() => {}, [coupon])

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
        <div>Subtotal: ${1}</div>
        <div>Tax: ${1}</div>
        <div>Subtotal: ${1}</div>
        <div>
          <strong>Total: ${1}</strong>
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
              ${discount} using the coupon {coupon}
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
