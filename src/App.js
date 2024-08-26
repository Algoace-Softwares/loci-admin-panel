import React, { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import { Amplify } from 'aws-amplify'
import aws_config from './aws-exports'
import MainRoutes from './layout/MainRoutes'
import { ToastContainer } from 'react-toastify'

const App = () => {
  Amplify.configure(aws_config)
  const { setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const isAdminLogin = localStorage.getItem('isAdminLogin')
  console.log('isAdminLogin', isAdminLogin)

  useEffect(() => {
    setColorMode('light')
  }, [setColorMode])

  return (
    <Router>
      <ToastContainer />
      <React.Fragment>
        <MainRoutes />
      </React.Fragment>
    </Router>
  )
}

export default App
