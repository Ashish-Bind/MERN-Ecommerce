import { useState } from 'react'
import ProductCard from '../components/ProductCard'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

const Search = () => {
  const [search, setSearch] = useState<string>('')
  const [sort, setSort] = useState<string>('')
  const [priceFilter, setPriceFilter] = useState<number>(0)
  const [category, setCategory] = useState<string>('')
  const [page, setPage] = useState<number>(1)

  const isNext = true
  const isPrev = true

  return (
    <div className="search">
      <aside>
        <h1>Filters</h1>

        <div>
          <label htmlFor="sort">Sort by</label>
          <select
            name=""
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">None</option>
            <option value="asc">Price(Low to High)</option>
            <option value="desc">Price(High to Low)</option>
          </select>
        </div>

        <div>
          <label htmlFor="price">Price</label>
          <input
            type="range"
            min={100}
            max={100000}
            id="price"
            value={priceFilter}
            onChange={(e) => setPriceFilter(Number(e.target.value))}
          />
        </div>

        <div>
          <label htmlFor="category">Category</label>
          <select
            name=""
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">None</option>
            <option value="1">Category 1</option>
            <option value="2">Category 2</option>
          </select>
        </div>
      </aside>
      <main>
        <h1>Products</h1>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search for items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="product-list">
          <ProductCard
            cartHandler={() => {}}
            id="1"
            img="https://m.media-amazon.com/images/I/71d7rfSl0wL._AC_UY327_FMwebp_QL65_.jpg"
            price={65000}
            name="Iphone"
            stock={10}
          />
        </div>

        <div className="pagination">
          <button disabled={isPrev} onClick={() => setPage((prev) => prev - 1)}>
            <FaArrowLeft />
          </button>
          <span>{page} out of 3</span>
          <button disabled={isNext} onClick={() => setPage((prev) => prev + 1)}>
            <FaArrowRight />
          </button>
        </div>
      </main>
    </div>
  )
}

export default Search
