/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import AdminSidebar from '../../../components/admin/AdminSidebar'
import { DoughnutChart, PieChart } from '../../../components/admin/Charts'
import { Skeleton } from '../../../components/Loader'
import { usePieQuery } from '../../../redux/api/stats'
import { RootState } from '../../../redux/store'

const PieCharts = () => {
  const { user } = useSelector((state: RootState) => state.userReducer)
  const {
    data: pieStats,
    isError,
    isLoading,
  } = usePieQuery(user?._id as string)

  if (isError) return <Navigate to={'/admin/dashboard'} />

  const inventory = pieStats?.pie.inventory!
  const stock = pieStats?.pie.stock!
  const age = pieStats?.pie.ageGroup!
  const role = pieStats?.pie.role!
  const revenue = pieStats?.pie.revenueDistribution!

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Pie & Doughnut Charts</h1>
        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            <section>
              <div>
                <PieChart
                  labels={['Processing', 'Shipped', 'Delivered']}
                  data={[
                    pieStats?.pie.processingOrders as number,
                    pieStats?.pie.shippedOrders as number,
                    pieStats?.pie.deliveredOrders as number,
                  ]}
                  backgroundColor={[
                    `hsl(110,80%, 80%)`,
                    `hsl(110,80%, 50%)`,
                    `hsl(110,40%, 50%)`,
                  ]}
                  offset={[0, 0, 50]}
                />
              </div>
              <h2>Order Fulfillment Ratio</h2>
            </section>

            <section>
              <div>
                <DoughnutChart
                  labels={inventory.map((i) => Object.keys(i)[0])}
                  data={inventory.map((i) => Object.values(i)[0])}
                  backgroundColor={inventory.map(
                    (i) =>
                      `hsl(${Object.values(i)[0] * 4}, ${
                        Object.values(i)[0]
                      }%, 50%)`
                  )}
                  legends={false}
                  offset={[0, 0, 0, 80]}
                />
              </div>
              <h2>Product Categories Ratio</h2>
            </section>

            <section>
              <div>
                <DoughnutChart
                  labels={['In Stock', 'Out Of Stock']}
                  data={[stock.inStock as number, stock.outOfStock as number]}
                  backgroundColor={['hsl(269,80%,40%)', 'rgb(53, 162, 255)']}
                  legends={false}
                  offset={[0, 80]}
                  cutout={'70%'}
                />
              </div>
              <h2> Stock Availability</h2>
            </section>

            <section>
              <div>
                <DoughnutChart
                  labels={[
                    'Marketing Cost',
                    'Discount',
                    'Burnt',
                    'Production Cost',
                    'Net Margin',
                  ]}
                  data={[
                    revenue?.marketingCost as number,
                    revenue?.discount as number,
                    revenue?.burnt as number,
                    revenue?.productionCost as number,
                    revenue?.netMargin as number,
                  ]}
                  backgroundColor={[
                    'hsl(110,80%,40%)',
                    'hsl(19,80%,40%)',
                    'hsl(69,80%,40%)',
                    'hsl(300,80%,40%)',
                    'rgb(53, 162, 255)',
                  ]}
                  legends={false}
                  offset={[20, 30, 20, 30, 80]}
                />
              </div>
              <h2>Revenue Distribution</h2>
            </section>

            <section>
              <div>
                <PieChart
                  labels={[
                    'Teenager(Below 20)',
                    'Adult (20-40)',
                    'Older (above 40)',
                  ]}
                  data={[
                    age?.teen as number,
                    age?.adult as number,
                    age?.old as number,
                  ]}
                  backgroundColor={[
                    `hsl(10, ${80}%, 80%)`,
                    `hsl(10, ${80}%, 50%)`,
                    `hsl(10, ${40}%, 50%)`,
                  ]}
                  offset={[0, 0, 50]}
                />
              </div>
              <h2>Users Age Group</h2>
            </section>

            <section>
              <div>
                <DoughnutChart
                  labels={['Admin', 'Customers']}
                  data={[role?.admin as number, role?.user as number]}
                  backgroundColor={[`hsl(335, 100%, 38%)`, 'hsl(44, 98%, 50%)']}
                  offset={[0, 50]}
                />
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default PieCharts
