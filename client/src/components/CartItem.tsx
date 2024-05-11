import React from 'react'
import { FaTrash } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { addToCart, removeFromCart } from '../redux/reducer/cartReducer'
import { server } from '../redux/store'
import toast from 'react-hot-toast'

interface CartItemProps {
  productId: string
  photo: string
  name: string
  price: number
  stock: number
  quantity: number
}

const CartItem = ({
  photo,
  name,
  price,
  quantity,
  productId,
  stock,
}: CartItemProps) => {
  const dispatch = useDispatch()

  const increment = () => {
    if (quantity >= stock) return toast.error('Maximum Stock')
    dispatch(
      addToCart({
        photo,
        name,
        price,
        quantity: quantity + 1,
        productId,
        stock,
      })
    )
  }
  const decrement = () => {
    if (quantity <= 1) return removeItem(productId)

    dispatch(
      addToCart({
        photo,
        name,
        price,
        quantity: quantity - 1,
        productId,
        stock,
      })
    )
  }

  const removeItem = (productId: string) => {
    toast.success('Item removed')
    dispatch(removeFromCart(productId))
  }

  return (
    <div className="item">
      <div className="item-details">
        <img src={`${server}${photo}`} alt={name} />
        <div>
          <p>{name}</p>
          <span>${price}</span>
        </div>
      </div>
      <div className="quantity">
        <button onClick={decrement}>-</button>
        <span>{quantity}</span>
        <button onClick={increment}>+</button>
        <FaTrash onClick={() => removeItem(productId)} />
      </div>
    </div>
  )
}

export default CartItem
