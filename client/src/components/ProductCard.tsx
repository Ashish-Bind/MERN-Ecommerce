import { FaBars, FaPlus } from 'react-icons/fa'
import { server } from '../redux/store'
import { CartItem } from '../types'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { addToCart } from '../redux/reducer/cartReducer'

interface ProductCardProps {
  productId: string
  photo: string
  name: string
  price: number
  stock: number
}

const ProductCard = ({
  productId,
  photo,
  name,
  price,
  stock,
}: ProductCardProps) => {
  const dispatch = useDispatch()

  const cartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error('Product out of stock')
    toast.success('Item added to cart')
    dispatch(addToCart(cartItem))
  }

  return (
    <div className="product-card">
      <img src={`${server}${photo}`} alt={name} />
      <h1>{name}</h1>
      <p>₹{price}</p>

      <div className="overlay">
        <button
          onClick={() =>
            cartHandler({
              productId,
              photo,
              name,
              price,
              stock,
              quantity: 1,
            })
          }
        >
          {<FaPlus />}
        </button>
        <button>{<FaBars />}</button>
      </div>
    </div>
  )
}

export default ProductCard
