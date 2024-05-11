import { ReactElement, useEffect, useState } from 'react'
import { ErrorResponse, Link } from 'react-router-dom'
import { Column } from 'react-table'
import AdminSidebar from '../../components/admin/AdminSidebar'
import TableHOC from '../../components/admin/TableHOC'
import { useAllOrdersQuery } from '../../redux/api/order'
import { UserReducerInitialState } from '../../types'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { Skeleton } from '../../components/Loader'

interface DataType {
  user: string
  amount: number
  discount: number
  quantity: number
  status: ReactElement
  action: ReactElement
}

const columns: Column<DataType>[] = [
  {
    Header: 'User',
    accessor: 'user',
  },
  {
    Header: 'Amount',
    accessor: 'amount',
  },
  {
    Header: 'Discount',
    accessor: 'discount',
  },
  {
    Header: 'Quantity',
    accessor: 'quantity',
  },
  {
    Header: 'Status',
    accessor: 'status',
  },
  {
    Header: 'Action',
    accessor: 'action',
  },
]

const Transaction = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  )
  const { data, isError, isLoading, error } = useAllOrdersQuery(
    user?._id as string
  )

  const [rows, setRows] = useState<DataType[]>([])

  if (isError) toast.error((error as ErrorResponse).data.message)

  useEffect(() => {
    if (data) {
      setRows(
        data.orders.map((i) => ({
          user: i.user.name,
          amount: i.total,
          discount: i.discount,
          status: (
            <span
              className={
                i.status === 'Processing'
                  ? 'red'
                  : i.status === 'Shipped'
                  ? 'green'
                  : 'purple'
              }
            >
              {i.status}
            </span>
          ),
          action: <Link to={`/admin/transaction/${i._id}`}>Manage</Link>,
          quantity: i.orderItems.length,
        }))
      )
    }
  }, [data])

  const Table = TableHOC<DataType>(
    columns,
    rows,
    'dashboard-product-box',
    'Transactions',
    rows.length > 6
  )()
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton /> : Table}</main>
    </div>
  )
}

export default Transaction
