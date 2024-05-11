import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { FaTrash } from 'react-icons/fa'
import AdminSidebar from '../../../components/admin/AdminSidebar'
import {
  useDeleteProductMutation,
  useSingleProductQuery,
  useUpdateProductMutation,
} from '../../../redux/api/product'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { server } from '../../../redux/store'
import { Skeleton } from '../../../components/Loader'
import { responseToast } from '../../../utils/feature'
import { useSelector } from 'react-redux'
import { UserReducerInitialState } from '../../../types'

const Productmanagement = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, isError } = useSingleProductQuery(id!)

  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  )

  const [updateProduct] = useUpdateProductMutation()
  const [deleteProduct] = useDeleteProductMutation()

  const { category, name, photo, price, stock, _id } = data?.product || {
    name: '',
    price: 0,
    category: '',
    stock: 0,
    photo: '',
    _id: '',
  }

  const [priceUpdate, setPriceUpdate] = useState<number>(price)
  const [stockUpdate, setStockUpdate] = useState<number>(stock)
  const [nameUpdate, setNameUpdate] = useState<string>(name)
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category)
  const [photoUpdate, setPhotoUpdate] = useState<string>('')
  const [photoFile, setPhotoFile] = useState<File>()

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0]

    const reader: FileReader = new FileReader()

    if (file) {
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotoUpdate(reader.result)
          setPhotoFile(file)
        }
      }
    }
  }

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData()

    if (nameUpdate) formData.set('name', nameUpdate)
    if (priceUpdate) formData.set('price', priceUpdate.toString())
    if (categoryUpdate) formData.set('category', categoryUpdate)
    if (stockUpdate !== undefined) formData.set('stock', stockUpdate.toString())
    if (photoFile) formData.set('photo', photoFile)

    const res = await updateProduct({
      adminId: user?._id as string,
      formData,
      productId: id!,
    })

    responseToast(res, navigate, '/admin/product')
  }

  const deleteHandler = async (adminId: string, productId: string) => {
    const res = await deleteProduct({ adminId, productId })

    responseToast(res, navigate, '/admin/product')
  }

  useEffect(() => {
    if (data) {
      setNameUpdate(data.product.name)
      setPriceUpdate(data.product.price)
      setStockUpdate(data.product.stock)
      setCategoryUpdate(data.product.category)
    }
  }, [data])

  if (isError) return <Navigate to={'/404'} />

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            <section>
              <strong>ID - ${_id}</strong>
              <img src={`${server}${photo}`} alt="Product" />
              <p>{name}</p>
              {stock > 0 ? (
                <span className="green">{stock} Available</span>
              ) : (
                <span className="red"> Not Available</span>
              )}
              <h3>₹{price}</h3>
            </section>
            <article>
              <button
                className="product-delete-btn"
                onClick={() => deleteHandler(user?._id as string, _id)}
                title="delete"
              >
                <FaTrash />
              </button>
              <form onSubmit={submitHandler}>
                <h2>Manage</h2>
                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={nameUpdate}
                    onChange={(e) => setNameUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={priceUpdate}
                    onChange={(e) => setPriceUpdate(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Stock</label>
                  <input
                    type="number"
                    placeholder="Stock"
                    value={stockUpdate}
                    onChange={(e) => setStockUpdate(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>Category</label>
                  <input
                    type="text"
                    placeholder="eg. laptop, camera etc"
                    value={categoryUpdate}
                    onChange={(e) => setCategoryUpdate(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="product-img">Photo</label>
                  <input
                    type="file"
                    onChange={changeImageHandler}
                    id="product-img"
                  />
                </div>

                {photoUpdate && <img src={photoUpdate} alt="New Image" />}
                <button type="submit">Update</button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  )
}

export default Productmanagement
