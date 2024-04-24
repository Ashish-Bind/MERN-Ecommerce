import React from 'react'
import { FaTrash } from 'react-icons/fa'

interface CartItemProps {
  id: string
  img: string
  name: string
  price: number
  stock: number
  quantity: number
}

const CartItem = ({ img, name, stock, price, quantity }: CartItemProps) => {
  return (
    <div className="item">
      <div className="item-details">
        <img src={img} alt={name} />
        <div>
          <p>{name}</p>
          <span>${price}</span>
        </div>
      </div>
      <div className="quantity">
        <button>-</button>
        <span>{quantity}</span>
        <button>+</button>
        <FaTrash />
      </div>
    </div>
  )
}

export default CartItem
