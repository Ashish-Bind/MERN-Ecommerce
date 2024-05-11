import { ReactElement, useEffect, useState } from 'react'
import TableHOC from '../components/admin/TableHOC'
import { Column } from 'react-table'
import { ErrorResponse, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { UserReducerInitialState } from '../types'
import { useOrderWithIdQuery } from '../redux/api/order'
import toast from 'react-hot-toast'
import { Skeleton } from '../components/Loader'

type DataType = {
  _id: string
  amount: number
  quantity: number
  discount: number
  status: ReactElement
  action: ReactElement
}

const column: Column<DataType>[] = [
  { Header: 'ID', accessor: '_id' },
  { Header: 'Amount', accessor: 'amount' },
  { Header: 'Quantity', accessor: 'quantity' },
  { Header: 'Discount', accessor: 'discount' },
  { Header: 'Status', accessor: 'status' },
  { Header: 'Action', accessor: 'action' },
]

const Orders = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  )
  const { data, isError, isLoading, error } = useOrderWithIdQuery(
    user?._id as string
  )
  const [row, setRows] = useState<DataType[]>([])

  const table = TableHOC<DataType>(
    column,
    row,
    'dashboard-product-box',
    'Orders'
  )()

  if (isError) toast.error((error as ErrorResponse).data.message)

  useEffect(() => {
    if (data) {
      setRows(
        data.orders.map((i) => ({
          _id: i._id,
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

  return (
    <div className="container">
      <h1>My Orders</h1>
      {isLoading ? (
        <Skeleton />
      ) : (data?.orders.length as number) < 1 ? (
        'No Orders'
      ) : (
        table
      )}
    </div>
  )
}

export default Orders
