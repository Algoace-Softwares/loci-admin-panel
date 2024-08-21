import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const isAuthenticated = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isAdminLogin = localStorage.getItem('isAdminLogin')
  useEffect(() => {
    console.log('AppContent', location)
    if (!isAdminLogin && location.pathname === '/login') {
      console.log('AppContent1')
      navigate('/login')
    } else if (!isAdminLogin && location.pathname === '/forget-password') {
      navigate('/forget-password')
    } else if (isAdminLogin) {
      console.log('AppContent2')
      navigate('/reports')
    } else {
      navigate('/login')
    }
  }, [])
}

export default isAuthenticated
