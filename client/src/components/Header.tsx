import { signOut } from 'firebase/auth'
import { useState } from 'react'
import toast from 'react-hot-toast'
import {
  FaSearch,
  FaShoppingBag,
  FaSignInAlt,
  FaSignOutAlt,
} from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../firebase.config'
import { User } from '../types'

const Header = ({ user }: { user: User | null }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const navigate = useNavigate()

  const logoutHandler = async () => {
    try {
      await signOut(auth)
      toast.success('Logged Out')
    } catch (error) {
      toast.error('Cannot log out')
    }
  }

  return (
    <nav className="header">
      <div className="logo">Ecom.</div>
      <div className="nav-links">
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
              <img src={user.photo} className="profile-img" title={user.name} />
            </button>
            <dialog open={isOpen}>
              <div>
                {user.role === 'admin' && (
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
      </div>
    </nav>
  )
}

export default Header
