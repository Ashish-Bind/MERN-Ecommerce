import {
  FaSearch,
  FaShoppingBag,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
} from 'react-icons/fa'
import { Link } from 'react-router-dom'

const user = { _id: '10', role: 'ADMIN' }

const Header = () => {
  return (
    <nav>
      <Link to={'/'}>Home</Link>
      <Link to={'/search'}>
        <FaSearch />
      </Link>
      <Link to={'/cart'}>
        <FaShoppingBag />
      </Link>
      {user?._id ? (
        <>
          <button>
            <FaUser />
          </button>
          <dialog open>
            <div>
              {user.role === 'ADMIN' && (
                <Link to={'/admin/dashboard'}>Admin</Link>
              )}
              <Link to={'/orders'}>Orders</Link>
              <button>
                <FaSignOutAlt />
              </button>
            </div>
          </dialog>
        </>
      ) : (
        <button>
          <FaSignInAlt />
        </button>
      )}
    </nav>
  )
}

export default Header
