import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
import { Amplify } from 'aws-amplify'
import aws_config from './amplifyconfiguration.json'
import ForgotPassword from './views/pages/forgotPassword/forgotPassword'
import ProtectedRoute from './components/ProtectedRoutes'

const App = () => {
  Amplify.configure(aws_config)
  const { setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const isAdminLogin = localStorage.getItem('isAdminLogin')
  console.log('isAdminLogin', isAdminLogin)
  useEffect(() => {
    setColorMode('light')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route exact path="/forget-password" name="ForgotPassword" element={<ForgotPassword />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route path="/" element={<ProtectedRoute element={<DefaultLayout />} />} />
          {/* isAdminLogin &&  */}
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
