import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

interface PropsType {
  children?: React.ReactElement
  isAuthenticated: boolean
  isAdmin?: boolean
  adminRoute?: boolean
  redirect?: string
}

const ProtectedRoutes = ({
  children,
  isAuthenticated,
  adminRoute,
  isAdmin,
  redirect = '/',
}: PropsType) => {
  if (!isAuthenticated) return <Navigate to={redirect} />

  if (adminRoute && !isAdmin) return <Navigate to={redirect} />

  return children ? children : <Outlet />
}

export default ProtectedRoutes
