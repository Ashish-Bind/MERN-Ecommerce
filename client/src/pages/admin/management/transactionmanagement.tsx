import { FaTrash } from 'react-icons/fa'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import AdminSidebar from '../../../components/admin/AdminSidebar'
import { OrderItem } from '../../../models/types'
import { server } from '../../../redux/store'
import { Order, UserReducerInitialState } from '../../../types'
import { useDispatch, useSelector } from 'react-redux'
import {
  useDeleteOrderMutation,
  useSingleOrderQuery,
  useUpdateOrderMutation,
} from '../../../redux/api/order'
import { useState } from 'react'
import { responseToast } from '../../../utils/feature'
import { Skeleton } from '../../../components/Loader'

const img =
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8&w=1000&q=804'

const orderItems: OrderItem[] = [
  {
    name: 'Puma Shoes',
    photo: img,
    id: 'asdsaasdas',
    quantity: 4,
    price: 2000,
  },
]

const defaultData: Order = {
  shippingInfo: {
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
  },
  status: '',
  subtotal: 0,
  discount: 0,
  shippingCharges: 0,
  tax: 0,
  total: 0,
  orderItems: [],
  user: {
    name: '',
    _id: '',
    email: '',
  },
  _id: '',
}

const TransactionManagement = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  )

  const { id } = useParams()
  const navigate = useNavigate()

  const [deleteProduct] = useDeleteOrderMutation()
  const [updateProduct] = useUpdateOrderMutation()

  const { data, isLoading, isError } = useSingleOrderQuery({
    adminId: user?._id as string,
    orderId: id!,
  })

  if (isError) return <Navigate to={'/404'} />

  const {
    shippingInfo,
    user: userInfo,
    subtotal,
    shippingCharges,
    tax,
    discount,
    total,
    status,
    orderItems,
  } = data?.order || defaultData

  const updateHandler = async ({
    adminId,
    orderId,
  }: {
    adminId: string
    orderId: string
  }) => {
    const res = await updateProduct({ adminId, orderId })
    responseToast(res, navigate, '/admin/transaction')
  }

  const deleteHandler = async ({
    adminId,
    orderId,
  }: {
    adminId: string
    orderId: string
  }) => {
    const res = await deleteProduct({ adminId, orderId })
    responseToast(res, navigate, '/admin/transaction')
  }

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            <section
              style={{
                padding: '2rem',
              }}
            >
              <h2>Order Items</h2>

              {orderItems.map((i) => (
                <ProductCard
                  key={i._id}
                  name={i.name}
                  photo={`${server}${i.photo}`}
                  productId={i.productId}
                  _id={i._id}
                  quantity={i.quantity}
                  price={i.price}
                />
              ))}
            </section>

            <article className="shipping-info-card">
              <button
                className="product-delete-btn"
                onClick={async () =>
                  await deleteHandler({
                    adminId: user?._id as string,
                    orderId: id!,
                  })
                }
              >
                <FaTrash />
              </button>
              <h1>Order Info</h1>
              <h5>User Info</h5>
              <p>Name: {userInfo.name}</p>
              <p>
                Address:{' '}
                {`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.country} ${shippingInfo.pincode}`}
              </p>
              <h5>Amount Info</h5>
              <p>Subtotal: {subtotal}</p>
              <p>Shipping Charges: {shippingCharges}</p>
              <p>Tax: {tax}</p>
              <p>Discount: {discount}</p>
              <p>Total: {total}</p>

              <h5>Status Info</h5>
              <p>
                Status:{' '}
                <span
                  className={
                    status === 'Delivered'
                      ? 'purple'
                      : status === 'Shipped'
                      ? 'green'
                      : 'red'
                  }
                >
                  {status}
                </span>
              </p>
              <button
                className="shipping-btn"
                onClick={async () =>
                  await updateHandler({
                    adminId: user?._id as string,
                    orderId: id!,
                  })
                }
              >
                Process Status
              </button>
            </article>
          </>
        )}
      </main>
    </div>
  )
}

const ProductCard = ({
  name,
  photo,
  price,
  quantity,
  productId,
}: OrderItem) => (
  <div className="transaction-product-card">
    <img src={photo} alt={name} />
    <Link to={`/product/${productId}`}>{name}</Link>
    <span>
      ₹{price} X {quantity} = ₹{price * quantity}
    </span>
  </div>
)

export default TransactionManagement
