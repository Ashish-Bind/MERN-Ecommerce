import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

const Home = () => {
  const addToCart = () => {}

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
        <ProductCard
          id="1"
          name="Iphone"
          price={69999}
          stock={20}
          cartHandler={addToCart}
          img="https://m.media-amazon.com/images/I/71d7rfSl0wL._AC_UY327_FMwebp_QL65_.jpg"
        />
      </main>
    </div>
  )
}

export default Home
