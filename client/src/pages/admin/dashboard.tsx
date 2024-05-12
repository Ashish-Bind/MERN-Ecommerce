/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { BiMaleFemale } from 'react-icons/bi'
import { HiTrendingDown, HiTrendingUp } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { BarChart, DoughnutChart } from '../../components/admin/Charts'
import Table from '../../components/admin/DashboardTable'
import { Skeleton } from '../../components/Loader'
import { useDashboardStatsQuery } from '../../redux/api/stats'
import { RootState } from '../../redux/store'
import { getLastMonths } from '../../utils/feature'

const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.userReducer)
  const {
    data: dashboardStats,
    isError,
    isLoading,
  } = useDashboardStatsQuery(user?._id as string)
  const last6Months = getLastMonths({ length: 6 })

  if (isError) return <Navigate to={'/'} />

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard">
        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            <section className="widget-container">
              <WidgetItem
                percent={dashboardStats?.stats.percentages.revenue as number}
                amount={true}
                value={dashboardStats?.stats.counts.revenue as number}
                heading="Revenue"
                color="rgb(0, 115, 255)"
              />
              <WidgetItem
                percent={dashboardStats?.stats.percentages.user as number}
                value={dashboardStats?.stats.counts.user as number}
                color="rgb(0 198 202)"
                heading="Users"
              />
              <WidgetItem
                percent={dashboardStats?.stats.percentages.order as number}
                value={dashboardStats?.stats.counts.order as number}
                color="rgb(255 196 0)"
                heading="Transactions"
              />

              <WidgetItem
                percent={dashboardStats?.stats.percentages.product as number}
                value={dashboardStats?.stats.counts.product as number}
                color="rgb(76 0 255)"
                heading="Products"
              />
            </section>

            <section className="graph-container">
              <div className="revenue-chart">
                <h2>Revenue & Transaction</h2>
                <BarChart
                  data_2={dashboardStats?.stats.charts.revenue as number[]}
                  data_1={dashboardStats?.stats.charts.order as number[]}
                  title_1="Revenue"
                  title_2="Transaction"
                  bgColor_1="rgb(0, 115, 255)"
                  bgColor_2="rgba(53, 162, 235, 0.8)"
                  labels={last6Months}
                />
              </div>

              <div className="dashboard-categories">
                <h2>Inventory</h2>
                <div>
                  {dashboardStats?.stats.inventory.map((i) => {
                    const [heading, value] = Object.entries(i)[0]
                    return (
                      <CategoryItem
                        key={heading}
                        value={value}
                        heading={heading}
                        color={`hsl(${value * 4}, ${value}%, 50%)`}
                      />
                    )
                  })}
                </div>
              </div>
            </section>

            <section className="transaction-container">
              <div className="gender-chart">
                <h2>Gender Ratio</h2>
                <DoughnutChart
                  labels={['Female', 'Male']}
                  data={[
                    dashboardStats?.stats.ratio.female as number,
                    dashboardStats?.stats.ratio.male as number,
                  ]}
                  backgroundColor={[
                    'hsl(340, 82%, 56%)',
                    'rgba(53, 162, 235, 0.8)',
                  ]}
                  cutout={90}
                />
                <p>
                  <BiMaleFemale />
                </p>
              </div>
              <Table data={dashboardStats?.stats.latest!} />
            </section>
          </>
        )}
      </main>
    </div>
  )
}

interface WidgetItemProps {
  heading: string
  value: number
  percent: number
  color: string
  amount?: boolean
}

const WidgetItem = ({
  heading,
  value,
  percent,
  color,
  amount = false,
}: WidgetItemProps) => (
  <article className="widget">
    <div className="widget-info">
      <p>{heading}</p>
      <h4>{amount ? `₹${value}` : value}</h4>
      {percent > 0 ? (
        <span className="green">
          <HiTrendingUp /> +{percent}%{' '}
        </span>
      ) : (
        <span className="red">
          <HiTrendingDown /> {percent}%{' '}
        </span>
      )}
    </div>

    <div
      className="widget-circle"
      style={{
        background: `conic-gradient(
        ${color} ${(Math.abs(percent) / 100) * 360}deg,
        rgb(255, 255, 255) 0
      )`,
      }}
    >
      <span
        style={{
          color,
        }}
      >
        {percent > 0 && `${percent > 10000 ? 9999 : percent}`}
        {percent < 0 && `${percent < -10000 ? -9999 : percent}`}%
      </span>
    </div>
  </article>
)

interface CategoryItemProps {
  color: string
  value: number
  heading: string
}

const CategoryItem = ({ color, value, heading }: CategoryItemProps) => (
  <div className="category-item">
    <h5>{heading}</h5>
    <div>
      <div
        style={{
          backgroundColor: color,
          width: `${value}%`,
        }}
      ></div>
    </div>
    <span>{value}%</span>
  </div>
)

export default Dashboard
