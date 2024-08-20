import { cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
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
import { confirmResetPassword, resetPassword } from 'aws-amplify/auth'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [isOtp, setIsOTP] = useState(false)
  const [otp, setOTP] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()
  const forgotPassword = async () => {
    try {
      setLoading(true)
      await resetPassword({ username: email })
      setIsOTP(true)
    } catch (error) {
      console.log('error reset password', error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const forgotPasswordConfirm = async () => {
    try {
      console.log('confirm forgot password')
      await confirmResetPassword({
        username: email,
        confirmationCode: otp,
        newPassword: confirmPassword,
      })
      toast.success('Successfully Password changes')
      navigate('/login')
    } catch (error) {
      console.log('error reset password', error)
      toast.error(error.message)
    }
  }
  console.log(email)
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
                    {!isOtp ? (
                      <>
                        <h1>Forgot Password</h1>
                        <p className="text-body-secondary">Please Enter your email</p>
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
                      </>
                    ) : (
                      <>
                        <div>
                          <h1>OTP</h1>
                          <p className="text-body-secondary">Please Check your email</p>
                          <CInputGroup className="mb-3">
                            <CInputGroupText>
                              <CIcon icon={cilUser} />
                            </CInputGroupText>
                            <CFormInput
                              placeholder="otp"
                              autoComplete="otp"
                              value={otp}
                              onChange={(e) => setOTP(e.target.value)}
                            />
                          </CInputGroup>
                        </div>
                        <div>
                          <h1>Password</h1>
                          <p className="text-body-secondary">Password</p>
                          <CInputGroup className="mb-3">
                            <CInputGroupText>
                              <CIcon icon={cilUser} />
                            </CInputGroupText>
                            <CFormInput
                              placeholder="password"
                              autoComplete="password"
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </CInputGroup>
                        </div>
                        <div>
                          <h1>Confirm Password</h1>
                          <p className="text-body-secondary">Confirm Password</p>
                          <CInputGroup className="mb-3">
                            <CInputGroupText>
                              <CIcon icon={cilUser} />
                            </CInputGroupText>
                            <CFormInput
                              placeholder="password"
                              autoComplete="password"
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                          </CInputGroup>
                        </div>
                      </>
                    )}
                    <CRow className="item-center">
                      <CCol xs={6}>
                        <CButton
                          color="primary"
                          className="px-4"
                          disabled={loading || !email}
                          onClick={() => {
                            !isOtp ? forgotPassword() : forgotPasswordConfirm()
                          }}
                        >
                          {loading ? (
                            <CSpinner size="sm" style={{ width: '1rem', height: '1rem' }} />
                          ) : !isOtp ? (
                            'Continue'
                          ) : (
                            'Confirm Password'
                          )}
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

export default ForgotPassword
