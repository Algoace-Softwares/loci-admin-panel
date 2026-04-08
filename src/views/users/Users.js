import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
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
import { getAllReports } from '../../service/Reports'

const Users = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [raw, setRaw] = useState([])

  // NOTE: until backend provides a dedicated users endpoint,
  // this page derives unique creators from reports results.
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await getAllReports(1, '')
        const items = res?.data?.data?.items ?? []
        setRaw(Array.isArray(items) ? items : [])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchText(query)
    }, 500),
    [],
  )

  const creators = useMemo(() => {
    const map = new Map()
    raw.forEach((item) => {
      const c = item?.reportedId
      if (!c) return
      const id = c?._id ?? c?.id
      if (!id) return
      if (!map.has(id)) {
        map.set(id, {
          id,
          name: c?.name ?? 'Loci_user',
          reportCount: c?.reportCount ?? 0,
        })
      }
    })
    return Array.from(map.values())
  }, [raw])

  const filteredCreators = useMemo(() => {
    const q = searchText.trim().toLowerCase()
    if (!q) return creators
    return creators.filter((c) => (c?.name ?? '').toLowerCase().includes(q))
  }, [creators, searchText])

  const goToUserDetails = (creator) => {
    if (!creator?.id) return
    navigate(`/users/${creator.id}`, {
      state: {
        creator: { _id: creator.id, name: creator.name },
      },
    })
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
                    <CTableHeaderCell className="bg-body-tertiary">Creator</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Report count</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredCreators.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan={3} className="text-center">
                        No users found
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    filteredCreators.map((c) => (
                      <CTableRow key={c.id}>
                        <CTableDataCell>{c.name}</CTableDataCell>
                        <CTableDataCell>{c.reportCount}</CTableDataCell>
                        <CTableDataCell>
                          <button
                            type="button"
                            onClick={() => goToUserDetails(c)}
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
                    ))
                  )}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Users
