// ProtectedRoute.js
import React from 'react'
import PropTypes from 'prop-types'
import { Navigate, Route } from 'react-router-dom'

// const ProtectedRoute = ({ element }) => {
//   const isAdminLogin = localStorage.getItem('isAdminLogin')
//   console.debug('isAdminLogin11', isAdminLogin ? 'j' : 'q')
//   return isAdminLogin ? <Navigate to="/reports" /> : element
// }

// ProtectedRoute.propTypes = {
//   element: PropTypes.element.isRequired,
// }

// export default ProtectedRoute

const PublicRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => <Component {...props} />} />
)
PublicRoute.propTypes = {
  component: PropTypes.element.isRequired,
}
// Protected Route Component
const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (isAuthenticated() ? <Component {...props} /> : <Navigate to="/login" />)}
  />
)

ProtectedRoute.propTypes = {
  component: PropTypes.element.isRequired,
}

export { ProtectedRoute, PublicRoute }
