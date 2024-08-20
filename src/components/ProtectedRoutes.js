// ProtectedRoute.js
import React from 'react'
import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ element }) => {
  const isAdminLogin = localStorage.getItem('isAdminLogin')
  console.log('isAdminLogin11', isAdminLogin)
  return isAdminLogin ? element : <Navigate to="/login" />
}

ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
}

export default ProtectedRoute
