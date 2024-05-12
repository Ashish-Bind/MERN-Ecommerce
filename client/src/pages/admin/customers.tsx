import { ReactElement, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaTrash } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Column } from 'react-table'
import AdminSidebar from '../../components/admin/AdminSidebar'
import TableHOC from '../../components/admin/TableHOC'
import { Skeleton } from '../../components/Loader'
import { useAllUsersQuery, useDeleteUserMutation } from '../../redux/api/user'
import { RootState } from '../../redux/store'
import { responseToast } from '../../utils/feature'

interface DataType {
  avatar: ReactElement
  name: string
  email: string
  gender: string
  role: string
  action: ReactElement
}

const columns: Column<DataType>[] = [
  {
    Header: 'Avatar',
    accessor: 'avatar',
  },
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Gender',
    accessor: 'gender',
  },
  {
    Header: 'Email',
    accessor: 'email',
  },
  {
    Header: 'Role',
    accessor: 'role',
  },
  {
    Header: 'Action',
    accessor: 'action',
  },
]

const Customers = () => {
  const { user } = useSelector((state: RootState) => state.userReducer)
  const { data, isLoading, isError } = useAllUsersQuery(user?._id as string)
  const [rows, setRows] = useState<DataType[]>([])

  const [deleteUser] = useDeleteUserMutation()

  const deleteHandler = async (userId: string) => {
    const res = await deleteUser({ adminId: user?._id as string, userId })
    responseToast(res, null, '')
  }

  if (isError) {
    toast.error('Something went wrong')
  }

  useEffect(() => {
    if (data) {
      setRows(
        data.users.map((i) => ({
          name: i.name,
          email: i.email,
          gender: i.gender,
          role: i.role,
          avatar: (
            <img
              style={{
                borderRadius: '50%',
              }}
              src={`${i.photo}`}
              alt="Shoes"
            />
          ),
          action: (
            <button
              onClick={async () => await deleteHandler(i._id!)}
              title="Delete user"
            >
              <FaTrash />
            </button>
          ),
        }))
      )
    }
  }, [data])

  const Table = TableHOC<DataType>(
    columns,
    rows,
    'dashboard-product-box',
    'Customers',
    rows.length > 6
  )()

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton /> : Table}</main>
    </div>
  )
}

export default Customers
