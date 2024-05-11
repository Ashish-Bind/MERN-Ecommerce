import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { Skeleton } from '../components/Loader'
import ProductCard from '../components/ProductCard'
import { useLatestProductsQuery } from '../redux/api/product'

const Home = () => {
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
          data?.products.map((i) => (
            <ProductCard
              productId={i._id}
              key={i._id}
              photo={i.photo}
              name={i.name}
              price={i.price}
              stock={i.stock}
            />
          ))
        )}
      </main>
    </div>
  )
}

export default Home
