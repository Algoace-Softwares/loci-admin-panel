import React, { useEffect, useLayoutEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { useColorModes } from '@coreui/react'
import './scss/style.scss'
import MainRoutes from './layout/MainRoutes'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import aws_config from './aws-exports'
import { Amplify } from 'aws-amplify'
import { NoInternetWrapper } from './components/NoInternet'

const App = () => {
  Amplify.configure(aws_config)
  const { setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  useLayoutEffect(() => {
    console.debug = function () {}
  }, [])

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
        <NoInternetWrapper />
      </React.Fragment>
    </Router>
  )
}

export default App
