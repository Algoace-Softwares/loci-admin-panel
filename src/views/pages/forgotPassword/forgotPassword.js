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
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { confirmResetPassword, resetPassword } from 'aws-amplify/auth'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [isOtp, setIsOTP] = useState(false)
  const [otp, setOTP] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMessage, setResendMessage] = useState('')
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const navigate = useNavigate()

  const onForgotPassword = async () => {
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.')
      return
    }

    try {
      setLoading(true)
      await resetPassword({ username: email })
      setIsOTP(true)
    } catch (error) {
      console.log('error reset password', error)
      toast.error(error.message || 'An error occurred while resetting password.')
    } finally {
      setLoading(false)
    }
  }
  // resend verification code
  const resendVerificationCode = async () => {
    try {
      setResendLoading(true)
      await resetPassword({ username: email }) // This request should trigger a new code
      setResendMessage('Verification code sent successfully.')
    } catch (error) {
      console.error('Error resending verification code:', error)
      setResendMessage(error.message || 'An error occurred while resending the verification code.')
    } finally {
      setResendLoading(false)
    }
  }

  const forgotPasswordConfirm = async () => {
    try {
      setLoading(true)
      console.log('confirm forgot password')
      await confirmResetPassword({
        username: email,
        confirmationCode: otp,
        newPassword: password,
      })
      toast.success('Successfully changed password.')
      navigate('/login')
    } catch (error) {
      console.log('error confirm reset password', error)
      toast.error(error.message || 'An error occurred while confirming the password.')
    } finally {
      setLoading(false)
    }
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
                    {!isOtp ? (
                      <>
                        <h1>Forgot Password</h1>
                        <p className="text-body-secondary">Please enter your email</p>
                        <CInputGroup className="mb-3">
                          <CInputGroupText>
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <CFormInput
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </CInputGroup>
                      </>
                    ) : (
                      <>
                        <h1>OTP</h1>
                        <p className="text-body-secondary">Please check your email for the OTP</p>
                        <CInputGroup className="mb-3">
                          <CInputGroupText>
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <CFormInput
                            placeholder="OTP"
                            type="text"
                            value={otp}
                            onChange={(e) => setOTP(e.target.value)}
                            required
                          />
                        </CInputGroup>
                        <p className="text-body-secondary">New Password</p>
                        <CInputGroup className="mb-3">
                          <CInputGroupText>
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <CFormInput
                            placeholder="New Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </CInputGroup>
                        <p className="text-body-secondary">Confirm Password</p>
                        <CInputGroup className="mb-3">
                          <CInputGroupText>
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <CFormInput
                            placeholder="Confirm Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                        </CInputGroup>
                        <CRow className="my-3">
                          <CCol xs={12}>
                            <CButton
                              color="secondary"
                              className="px-4"
                              disabled={resendLoading || !email}
                              onClick={resendVerificationCode}
                            >
                              {resendLoading ? (
                                <CSpinner size="sm" style={{ width: '1rem', height: '1rem' }} />
                              ) : (
                                'Resend Code'
                              )}
                            </CButton>
                            {resendMessage && <p className="text-success">{resendMessage}</p>}
                          </CCol>
                        </CRow>
                      </>
                    )}
                    <CRow className="justify-content-between">
                      <CCol sm={6} className="text-start">
                        <CButton
                          color="primary"
                          className="px-4"
                          disabled={
                            loading || !email || (isOtp && (password !== confirmPassword || !otp))
                          }
                          onClick={() => {
                            !isOtp ? onForgotPassword() : forgotPasswordConfirm()
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
                      <CCol sm={6} className="text-end">
                        {!isOtp && (
                          <CButton
                            color="primary"
                            onClick={() => {
                              navigate('/login')
                            }}
                          >
                            Back
                          </CButton>
                        )}
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
      />{' '}
      {/* Add ToastContainer here */}
    </div>
  )
}

export default ForgotPassword
