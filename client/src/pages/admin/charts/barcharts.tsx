/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { useSelector } from 'react-redux'
import AdminSidebar from '../../../components/admin/AdminSidebar'
import { BarChart } from '../../../components/admin/Charts'
import { useBarQuery } from '../../../redux/api/stats'
import { RootState } from '../../../redux/store'
import toast from 'react-hot-toast'
import { Skeleton } from '../../../components/Loader'
import { getLastMonths } from '../../../utils/feature'

const Barcharts = () => {
  const { user } = useSelector((state: RootState) => state.userReducer)
  const {
    data: barStats,
    isError,
    isLoading,
  } = useBarQuery(user?._id as string)
  const last6Months = getLastMonths({ length: 6 })
  const last12Months = getLastMonths({ length: 12 })

  if (isError) return toast.error('Something went wrong')

  const orders = barStats?.bar.order!
  const products = barStats?.bar.product!
  const users = barStats?.bar.user!

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Bar Charts</h1>
        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            <section>
              <BarChart
                data_2={users}
                data_1={products}
                title_1="Products"
                title_2="Users"
                bgColor_1={`hsl(260, 50%, 30%)`}
                bgColor_2={`hsl(360, 90%, 90%)`}
                labels={last6Months}
              />
              <h2>Top Products & Top Customers</h2>
            </section>

            <section>
              <BarChart
                horizontal={true}
                data_1={orders}
                data_2={[]}
                title_1="Orders"
                title_2=""
                bgColor_1={`hsl(180, 40%, 50%)`}
                bgColor_2=""
                labels={last12Months}
              />
              <h2>Orders throughout the year</h2>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default Barcharts
