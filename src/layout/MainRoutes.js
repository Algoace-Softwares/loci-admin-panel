import React, { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
import isAuthenticated from '../hooks/isAuthenticated'

// Lazy-loaded components
const Register = lazy(() => import('../views/pages/register/Register'))
const Login = lazy(() => import('../views/pages/login/Login'))
const ForgotPassword = lazy(() => import('../views/pages/forgotPassword/ForgotPassword.js'))
const Page500 = lazy(() => import('../views/pages/page500/Page500'))
const DefaultLayout = lazy(() => import('./DefaultLayout'))

const MainRoutes = () => {
  isAuthenticated()
  return (
    <Suspense
      fallback={
        <div className="pt-3 text-center">
          <CSpinner color="primary" variant="grow" />
        </div>
      }
    >
      <Routes>
        <Route exact path="/register" name="Register Page" element={<Register />} />
        <Route exact path="/login" name="Login Page" element={<Login />} />
        <Route
          exact
          path="/forget-password"
          name="Forgot Password Page"
          element={<ForgotPassword />}
        />
        <Route exact path="/500" name="Page 500" element={<Page500 />} />
        <Route path="*" element={<DefaultLayout />} />
      </Routes>
    </Suspense>
  )
}

export default MainRoutes
