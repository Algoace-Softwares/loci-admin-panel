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
  const [isOtp, setIsOTP] = useState(true)
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
      if (error.message === 'Username/client id combination not found.')
        return toast.error('User not exist')

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
    // Password validation regex
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/

    if (!passwordRegex.test(password)) {
      toast.error(
        'Password must be 8-50 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
      )
      return
    }
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

  const numberRegex = /^[0-9]*$/

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
                            onChange={(e) => {
                              const input = e.target.value

                              // Regex pattern to allow valid email characters (during typing)
                              const regex = /^[a-zA-Z0-9._%+-]*$/

                              // Check if the input matches valid characters or is empty
                              if (regex.test(input) || input === '' || input.includes('@')) {
                                setEmail(input)
                              }
                            }}
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
                            type="text" // Use "text" to apply regex validation
                            value={otp}
                            onChange={(e) => {
                              if (!numberRegex.test(e.target.value)) {
                                toast.error('Please enter valid otp')
                              } else {
                                setOTP(e.target.value)
                              }
                            }}
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
