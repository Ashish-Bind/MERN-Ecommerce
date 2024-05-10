import { ChangeEvent, useState } from 'react'
import AdminSidebar from '../../../components/admin/AdminSidebar'
import { UserReducerInitialState } from '../../../types'
import { useSelector } from 'react-redux'
import { useNewProductMutation } from '../../../redux/api/product'
import toast from 'react-hot-toast'
import { responseToast } from '../../../utils/feature'
import { useNavigate } from 'react-router-dom'

const NewProduct = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  )
  const navigate = useNavigate()

  const [name, setName] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [price, setPrice] = useState<number>(1000)
  const [stock, setStock] = useState<number>(1)
  const [photoPrev, setPhotoPrev] = useState<string>('')
  const [photo, setPhoto] = useState<File>()

  const [newProduct] = useNewProductMutation()

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0]

    const reader: FileReader = new FileReader()

    if (file) {
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotoPrev(reader.result)
          setPhoto(file)
        }
      }
    }
  }

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name || !stock || !price || !category || !photo) {
      toast.error('Enter all fields')
      return
    }

    const formData = new FormData()

    formData.set('name', name)
    formData.set('price', price.toString())
    formData.set('category', category)
    formData.set('stock', stock.toString())
    formData.set('photo', photo)

    const res = await newProduct({ adminId: user?._id as string, formData })

    responseToast(res, navigate, '/admin/product')
  }

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form onSubmit={submitHandler}>
            <h2>New Product</h2>
            <div>
              <label>Name</label>
              <input
                required
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                required
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                required
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Category</label>
              <input
                required
                type="text"
                placeholder="eg. laptop, camera etc"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="product-img">Photo</label>
              <input
                type="file"
                onChange={changeImageHandler}
                required
                id="product-img"
              />
            </div>

            {photoPrev && <img src={photoPrev} alt="New Image" />}
            <button type="submit">Create</button>
          </form>
        </article>
      </main>
    </div>
  )
}

export default NewProduct
