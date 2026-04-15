import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const isAuthenticated = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isAdminLogin = localStorage.getItem('isAdminLogin')
  useEffect(() => {
    const publicPaths = ['/login', '/forget-password', '/register']
    const isPublic = publicPaths.includes(location.pathname)

    if (isAdminLogin && isPublic) {
      // Logged in but on a public page — send to reports
      navigate('/reports')
    } else if (!isAdminLogin && !isPublic) {
      // Not logged in and trying to access a protected page — send to login
      navigate('/login')
    }
    // Otherwise stay on the current page
  }, [])
}

export default isAuthenticated
