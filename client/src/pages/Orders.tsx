import React, { ReactElement, useState } from 'react'
import TableHOC from '../components/admin/TableHOC'
import { Column } from 'react-table'
import { Link } from 'react-router-dom'

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
  const [row] = useState<DataType[]>([
    {
      _id: '1',
      amount: 5,
      quantity: 12,
      discount: 500,
      status: <span>Processing</span>,
      action: <Link to={`/order/1`}>View</Link>,
    },
  ])

  const table = TableHOC<DataType>(
    column,
    row,
    'dashboard-product-box',
    'Orders'
  )()

  return (
    <div className="container">
      <h1>My Orders</h1>
      {table}
    </div>
  )
}

export default Orders
