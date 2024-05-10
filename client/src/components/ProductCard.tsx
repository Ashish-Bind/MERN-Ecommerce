import { FaBars, FaPlus } from 'react-icons/fa'
import { server } from '../redux/store'

interface ProductCardProps {
  id: string
  img: string
  name: string
  price: number
  cartHandler: () => void
  stock: number
}

const ProductCard = ({
  cartHandler,
  id,
  img,
  name,
  price,
  stock,
}: ProductCardProps) => {
  return (
    <div className="product-card">
      <img src={`${server}${img}`} alt={name} />
      <h1>{name}</h1>
      <p>₹{price}</p>

      <div className="overlay">
        <button onClick={cartHandler}>{<FaPlus />}</button>
        <button onClick={cartHandler}>{<FaBars />}</button>
      </div>
    </div>
  )
}

export default ProductCard
