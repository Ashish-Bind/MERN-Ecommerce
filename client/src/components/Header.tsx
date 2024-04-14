import { useState } from 'react'
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
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const logoutHandler = () => {}

  return (
    <nav className="header">
      <Link to={'/'} onClick={() => setIsOpen(false)}>
        Home
      </Link>
      <Link to={'/search'}>
        <FaSearch />
      </Link>
      <Link to={'/cart'}>
        <FaShoppingBag />
      </Link>
      {user?._id ? (
        <>
          <button onClick={() => setIsOpen((prev) => !prev)}>
            <FaUser />
          </button>
          <dialog open={isOpen}>
            <div>
              {user.role === 'ADMIN' && (
                <Link to={'/admin/dashboard'}>Admin</Link>
              )}
              <Link to={'/orders'}>Orders</Link>
              <button onClick={logoutHandler}>
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
