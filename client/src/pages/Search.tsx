import { useState } from 'react'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { ErrorResponse } from 'react-router-dom'
import { Skeleton } from '../components/Loader'
import ProductCard from '../components/ProductCard'
import {
  useAllCategoriesQuery,
  useSearchProductsQuery,
} from '../redux/api/product'

const Search = () => {
  const {
    data: categoriesResponse,
    isError,
    isLoading: loadingCategories,
    error,
  } = useAllCategoriesQuery('')

  const [search, setSearch] = useState<string>('')
  const [sort, setSort] = useState<string>('')
  const [priceFilter, setPriceFilter] = useState<number>(0)
  const [category, setCategory] = useState<string>('')
  const [page, setPage] = useState<number>(1)

  const {
    data: searchResponse,
    isLoading: loadingSearch,
    isError: isSearchError,
    error: searchError,
  } = useSearchProductsQuery({
    search,
    page,
    sort,
    category,
    price: priceFilter,
  })

  const addtoCartHandler = () => {}

  if (isError) toast.error((error as ErrorResponse).data.message)
  if (isSearchError) toast.error((searchError as ErrorResponse).data.message)

  const isPrev = page > 1
  const isNext = page < (searchResponse?.totalpage || 1)

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
          <label htmlFor="price">Price ₹{priceFilter}</label>
          <input
            type="range"
            min={100}
            max={1000000}
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
            <option value="">All</option>
            {loadingCategories === false &&
              categoriesResponse?.categories.map((i) => (
                <option value={i}>{i[0].toUpperCase() + i.slice(1)}</option>
              ))}
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
          {loadingSearch ? (
            <Skeleton />
          ) : (
            searchResponse?.products.map((i) => (
              <ProductCard
                cartHandler={addtoCartHandler}
                id={i._id}
                img={i.photo}
                price={i.price}
                name={i.name}
                stock={i.stock}
              />
            ))
          )}
        </div>

        <div className="pagination">
          <button
            disabled={!isPrev}
            onClick={() => setPage((prev) => prev - 1)}
            title="previous"
          >
            <FaArrowLeft />
          </button>
          <span>
            {page} out of {searchResponse?.totalpage}
          </span>
          <button
            disabled={!isNext}
            onClick={() => setPage((prev) => prev + 1)}
            title="next"
          >
            <FaArrowRight />
          </button>
        </div>
      </main>
    </div>
  )
}

export default Search
