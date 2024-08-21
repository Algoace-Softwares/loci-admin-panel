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
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'
import isAuthenticated from '../../../hooks/isAuthenticated'

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
    try {
      setLoading(true)
      const response = await login(email, password)
      const token = response.credentials?.credentials?.sessionToken
      localStorage.setItem('token', token)
      localStorage.setItem('isAdminLogin', true)
      navigate('/reports')
    } catch (error) {
      console.log('error:', error)
      toast.error('error:' + error)
    } finally {
      setLoading(false)
    }
  }

  // Function to handle forgot password
  const handleForgotPassword = async () => {
    navigate('/forget-password')
    console.log('Forgot password clicked')
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <ToastContainer />
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
                        placeholder="email"
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
                          disabled={loading}
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
                        <CButton color="link" className="p-0" onClick={handleForgotPassword}>
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
    </div>
  )
}

export default Login
