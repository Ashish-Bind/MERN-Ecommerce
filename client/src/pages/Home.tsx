import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { Skeleton } from '../components/Loader'
import ProductCard from '../components/ProductCard'
import { useLatestProductsQuery } from '../redux/api/product'

const Home = () => {
  const addToCart = () => {}

  const { data, isLoading, isError } = useLatestProductsQuery('')

  if (isError) return toast.error('Cannot fetch latest products')

  return (
    <div className="home">
      <section></section>
      <h1>
        Latest
        <Link to={'/search'} className="find-more">
          More
        </Link>
      </h1>
      <main>
        {isLoading ? (
          <Skeleton />
        ) : (
          data?.products.map((item) => (
            <ProductCard
              id={item._id}
              name={item.name}
              price={item.price}
              stock={item.stock}
              cartHandler={addToCart}
              img={item.photo}
            />
          ))
        )}
      </main>
    </div>
  )
}

export default Home
