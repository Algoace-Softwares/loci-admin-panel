import React, { useState } from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CSpinner,
} from '@coreui/react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/8.jpg'
import { signOut } from 'aws-amplify/auth'
import { useNavigate } from 'react-router-dom'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const onLogout = async () => {
    try {
      localStorage.clear()
      setLoading(true)
      await signOut()
      navigate('/login')
      // Optionally, you can handle any post-sign-out logic here
    } catch (error) {
      // Handle any errors that occur during the sign-out process
      console.error('Sign-out error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <div onClick={() => onLogout()}>
          <CDropdownItem href="#">
            <CIcon icon={cilLockLocked} className="me-2" disabled={loading} />
            {!loading ? 'logout' : <CSpinner size="sm" style={{ width: '1rem', height: '1rem' }} />}
          </CDropdownItem>
        </div>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
