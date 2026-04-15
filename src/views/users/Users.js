import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { debounce } from 'lodash'
import { getAllUsers } from '../../service/Admin'

const Users = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [searchText, setSearchText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchUsers = async (page, name) => {
    try {
      setLoading(true)
      const res = await getAllUsers(page, name)
      console.debug('getAllUsers raw response:', res?.data)

      const d = res?.data
      // handle: { data: { items: [] } } or { data: [] } or { items: [] } or []
      const items =
        d?.data?.items ??
        d?.data?.users ??
        (Array.isArray(d?.data) ? d.data : null) ??
        d?.items ??
        d?.users ??
        (Array.isArray(d) ? d : [])

      const pageInfo = d?.data ?? d ?? {}
      setUsers(Array.isArray(items) ? items : [])
      setTotalPages(pageInfo.totalPages ?? 1)
    } catch (e) {
      console.debug('users fetch error', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers(currentPage, searchText)
  }, [currentPage, searchText])

  const debouncedSearch = useCallback(
    debounce((query) => {
      setCurrentPage(1)
      setSearchText(query)
    }, 500),
    [],
  )

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage)
  }

  const goToUserDetails = (user) => {
    const id = user?._id ?? user?.id
    if (!id) return
    navigate(`/users/${id}`, { state: { user } })
  }

  return (
    <CRow>
      <CCol xs>
        <CCard className="mb-4">
          <CCardHeader>Users</CCardHeader>
          <CCardBody>
            <div className="mb-3">
              <CFormInput
                type="text"
                placeholder="Search user by name"
                onChange={(e) => debouncedSearch(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="d-flex justify-content-center py-5">
                <CSpinner size="sm" style={{ width: '3rem', height: '3rem' }} />
              </div>
            ) : (
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary">Name</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Email</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Status</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {users.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan={4} className="text-center">
                        No users found
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    users.map((user) => {
                      const id = user?._id ?? user?.id
                      return (
                        <CTableRow key={id}>
                          <CTableDataCell>{user?.name ?? '—'}</CTableDataCell>
                          <CTableDataCell>{user?.email ?? '—'}</CTableDataCell>
                          <CTableDataCell>
                            {user?.isOnline ? (
                              <span className="text-success">Online</span>
                            ) : (
                              <span className="text-muted">Offline</span>
                            )}
                          </CTableDataCell>
                          <CTableDataCell>
                            <button
                              type="button"
                              onClick={() => goToUserDetails(user)}
                              style={{
                                border: 'none',
                                background: 'transparent',
                                color: '#0d6efd',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                                padding: 0,
                              }}
                            >
                              View details
                            </button>
                          </CTableDataCell>
                        </CTableRow>
                      )
                    })
                  )}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>

        <div className="pagination-controls d-flex align-items-center justify-content-between my-3">
          <CButton
            color="primary"
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || totalPages === 0}
          >
            Previous
          </CButton>
          <span>Page {totalPages === 0 ? 0 : currentPage} of {totalPages}</span>
          <CButton
            color="primary"
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </CButton>
        </div>
      </CCol>
    </CRow>
  )
}

export default Users
