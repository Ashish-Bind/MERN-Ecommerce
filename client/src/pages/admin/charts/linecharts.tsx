/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import AdminSidebar from '../../../components/admin/AdminSidebar'
import { LineChart } from '../../../components/admin/Charts'
import { Skeleton } from '../../../components/Loader'
import { useLineQuery } from '../../../redux/api/stats'
import { RootState } from '../../../redux/store'
import { getLastMonths } from '../../../utils/feature'

const Linecharts = () => {
  const { user } = useSelector((state: RootState) => state.userReducer)
  const {
    data: lineStats,
    isError,
    isLoading,
  } = useLineQuery(user?._id as string)
  const last6Months = getLastMonths({ length: 6 })
  const last12Months = getLastMonths({ length: 12 })

  console.log(last12Months, last6Months)

  if (isError) return toast.error('Something went wrong')

  const revenue = lineStats?.line.revenue!
  const products = lineStats?.line.product!
  const users = lineStats?.line.user!
  const discount = lineStats?.line.discount!

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Line Charts</h1>
        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            <section>
              <LineChart
                data={users}
                label="Users"
                borderColor="rgb(53, 162, 255)"
                backgroundColor="rgba(53, 162, 255, 0.5)"
                labels={last12Months}
              />
              <h2>Active Users</h2>
            </section>

            <section>
              <LineChart
                data={products}
                backgroundColor={'hsla(269,80%,40%,0.4)'}
                borderColor={'hsl(269,80%,40%)'}
                labels={last12Months}
                label="Products"
              />
              <h2>Total Products (SKU)</h2>
            </section>

            <section>
              <LineChart
                data={revenue}
                backgroundColor={'hsla(129,80%,40%,0.4)'}
                borderColor={'hsl(129,80%,40%)'}
                label="Revenue"
                labels={last12Months}
              />
              <h2>Total Revenue </h2>
            </section>

            <section>
              <LineChart
                data={discount}
                backgroundColor={'hsla(29,80%,40%,0.4)'}
                borderColor={'hsl(29,80%,40%)'}
                label="Discount"
                labels={last12Months}
              />
              <h2>Discount Allotted </h2>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default Linecharts
