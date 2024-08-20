import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const isAuthenticated = () => {
  const navigate = useNavigate()
  const isAdminLogin = localStorage.getItem('isAdminLogin')
  useEffect(() => {
    console.log('AppContent')
    if (!isAdminLogin) {
      console.log('AppContent1')
      navigate('/login')
    } else {
      console.log('AppContent2')
      navigate('/reports')
    }
  }, [])
}

export default isAuthenticated
