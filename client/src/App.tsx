import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Loader from './components/Loader'
import Header from './components/Header'
import { useDispatch, useSelector } from 'react-redux'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase.config'
import { getUserWithId } from './redux/api/user'
import { noUserExist, userExist } from './redux/reducer/userReducer'
import { UserReducerInitialState } from './types'
import ProtectedRoutes from './components/ProtectedRoutes'

const Home = lazy(() => import('./pages/Home'))
const Search = lazy(() => import('./pages/Search'))
const Cart = lazy(() => import('./pages/Cart'))
const Shipping = lazy(() => import('./pages/Shipping'))
const Checkout = lazy(() => import('./pages/Checkout'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Login = lazy(() => import('./pages/Login'))
const Orders = lazy(() => import('./pages/Orders'))
const OrderDetails = lazy(() => import('./pages/OrderDetails'))

const Dashboard = lazy(() => import('./pages/admin/dashboard'))
const Products = lazy(() => import('./pages/admin/products'))
const Customers = lazy(() => import('./pages/admin/customers'))
const Transaction = lazy(() => import('./pages/admin/transaction'))
const Barcharts = lazy(() => import('./pages/admin/charts/barcharts'))
const Piecharts = lazy(() => import('./pages/admin/charts/piecharts'))
const Linecharts = lazy(() => import('./pages/admin/charts/linecharts'))
const Coupon = lazy(() => import('./pages/admin/apps/coupon'))
const Stopwatch = lazy(() => import('./pages/admin/apps/stopwatch'))
const Toss = lazy(() => import('./pages/admin/apps/toss'))
const NewProduct = lazy(() => import('./pages/admin/management/newproduct'))
const ProductManagement = lazy(
  () => import('./pages/admin/management/productmanagement')
)
const TransactionManagement = lazy(
  () => import('./pages/admin/management/transactionmanagement')
)

const App = () => {
  const dispatch = useDispatch()
  const { user, loading } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  )

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await getUserWithId(user.uid)
        dispatch(userExist(data.user))
        console.log('Logged In')
      } else {
        console.log('Not logged In')
        dispatch(noUserExist())
      }
    })
  }, [])

  return loading ? (
    <Loader />
  ) : (
    <Router>
      <Toaster position="top-center" />
      <Header user={user} />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/login"
            element={
              <ProtectedRoutes isAuthenticated={user ? false : true}>
                <Login />
              </ProtectedRoutes>
            }
          />

          {/* Protected Routes */}
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/checkout/pay" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/order/:id" element={<OrderDetails />} />

          {/* Admin Routes */}
          <Route
            element={
              <ProtectedRoutes
                isAuthenticated={true}
                isAdmin={user?.role === 'admin' ? true : false}
                adminRoute={true}
              />
            }
          >
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/product" element={<Products />} />
            <Route path="/admin/customer" element={<Customers />} />
            <Route path="/admin/transaction" element={<Transaction />} />
            {/* Charts */}
            <Route path="/admin/chart/bar" element={<Barcharts />} />
            <Route path="/admin/chart/pie" element={<Piecharts />} />
            <Route path="/admin/chart/line" element={<Linecharts />} />
            {/* Apps */}
            <Route path="/admin/app/coupon" element={<Coupon />} />
            <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
            <Route path="/admin/app/toss" element={<Toss />} />

            {/* Management */}
            <Route path="/admin/product/new" element={<NewProduct />} />

            <Route path="/admin/product/:id" element={<ProductManagement />} />

            <Route
              path="/admin/transaction/:id"
              element={<TransactionManagement />}
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
