import React, { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import MainRoutes from './layout/MainRoutes'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const { setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const isAdminLogin = localStorage.getItem('isAdminLogin')
  console.log('isAdminLogin', isAdminLogin)

  useEffect(() => {
    setColorMode('light')
  }, [setColorMode])

  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <React.Fragment>
        <MainRoutes />
      </React.Fragment>
    </Router>
  )
}

export default App
