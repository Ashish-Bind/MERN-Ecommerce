import { useState } from 'react'
import {
  FaSearch,
  FaShoppingBag,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
} from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'

const user = { _id: '', role: '' }

const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const navigate = useNavigate()

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
        <button onClick={() => navigate('/login')}>
          <FaSignInAlt />
        </button>
      )}
    </nav>
  )
}

export default Header
