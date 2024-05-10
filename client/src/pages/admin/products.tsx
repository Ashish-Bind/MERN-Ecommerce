import { ReactElement, useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { Column } from 'react-table'
import AdminSidebar from '../../components/admin/AdminSidebar'
import TableHOC from '../../components/admin/TableHOC'
import { useAdminProductsQuery } from '../../redux/api/product'
import toast from 'react-hot-toast'
import { ErrorResponse, UserReducerInitialState } from '../../types'
import { useSelector } from 'react-redux'
import { Skeleton } from '../../components/Loader'

interface DataType {
  photo: ReactElement
  name: string
  price: number
  stock: number
  action: ReactElement
}

const columns: Column<DataType>[] = [
  {
    Header: 'Photo',
    accessor: 'photo',
  },
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Price',
    accessor: 'price',
  },
  {
    Header: 'Stock',
    accessor: 'stock',
  },
  {
    Header: 'Action',
    accessor: 'action',
  },
]

const Products = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  )

  const { data, isLoading, isError, error } = useAdminProductsQuery(
    user?._id as string
  )
  const [rows, setRows] = useState<DataType[]>([])

  if (isError) toast.error((error as ErrorResponse).data.message)

  useEffect(() => {
    if (data)
      setRows(
        data.products.map((i) => ({
          photo: (
            <img src={`http://localhost:3000/${i.photo}`} title={i.name} />
          ),
          name: i.name,
          price: i.price,
          stock: i.stock,
          action: <Link to={`/admin/product/${i._id}`}>Manage</Link>,
        }))
      )
  }, [data])

  const Table = TableHOC<DataType>(
    columns,
    rows,
    'dashboard-product-box',
    'Products',
    rows.length > 6
  )()

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton /> : Table}</main>
      <Link to="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  )
}

export default Products
