import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { login } from '../../../service/Auth'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import isAuthenticated from '../../../hooks/isAuthenticated'
import 'react-toastify/dist/ReactToastify.css'

const Login = () => {
  // navigate
  const navigate = useNavigate()

  // State for email and password
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  console.log('first')
  isAuthenticated()
  // Function to handle login
  const handleLogin = async () => {
    // Regex for validating an email
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i

    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.') // Show error message
      return // Exit the function if email is invalid
    }

    try {
      setLoading(true)
      const response = await login(email, password)
      const token = response?.credentials?.credentials?.sessionToken
      localStorage.setItem('token', token)
      localStorage.setItem('isAdminLogin', true)
      navigate('/reports')
      toast.success('Login successful!') // Show success message
    } catch (error) {
      console.error('error:', error)
      toast.error(error.message || 'An error occurred during login.') // Show error message
    } finally {
      setLoading(false)
    }
  }

  // Function to handle forgot password
  const handleForgotPassword = () => {
    navigate('/forget-password')
    console.log('Forgot password clicked')
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Enter your email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow className="item-center">
                      <CCol xs={6}>
                        <CButton
                          color="primary"
                          className="px-4"
                          disabled={loading || !email || !password}
                          onClick={handleLogin}
                        >
                          {!loading ? (
                            'Login'
                          ) : (
                            <CSpinner size="sm" style={{ width: '1rem', height: '1rem' }} />
                          )}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-end">
                        <CButton
                          color="link"
                          className="p-0"
                          disabled={loading}
                          onClick={handleForgotPassword}
                        >
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
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
    </div>
  )
}

export default Login
