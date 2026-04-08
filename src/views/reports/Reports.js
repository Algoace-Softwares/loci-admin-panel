import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { CSVLink } from 'react-csv'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCardBody,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFormInput,
  CFormTextarea,
  CModal,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilOptions } from '@coreui/icons'
import { getAllReports, updateReportById } from '../../service/Reports'
import { toast } from 'react-toastify'
import { debounce } from 'lodash'

const Reports = () => {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [feedback, setFeedBack] = useState('')
  const [rowId, setRowId] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [onSaveLoading, setOnSaveLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [action, setAction] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllReports(currentPage, searchText.trim())
        if (response?.data?.error) {
          toast.error(response?.data?.message)
          return
        }
        const result = response?.data?.data?.items ?? []
        const pageInfo = response?.data?.data ?? {}

        setData(result)
        setTotalPages(pageInfo.totalPages ?? 1)
      } catch (error) {
        toast.error(error?.message || 'Failed to load reports')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentPage, searchText])

  const date = new Date()
  const formattedDate = date.toLocaleDateString()
  const headers = [
    { label: 'Creator', key: 'reportedId.name' },
    { label: 'No. of reports', key: 'reportedId.reportCount' },
    { label: 'Reasons', key: 'reasons' },
  ]

  const onActionPerformed = (nextAction, item) => {
    setAction(nextAction)
    setVisible(true)
    setRowId(item?._id)
  }

  const onSubmit = async () => {
    try {
      setOnSaveLoading(true)
      const res = await updateReportById(rowId, feedback, action)
      if (res?.data?.error) {
        toast.error(res?.data?.message)
        return
      }
      setVisible(false)
      setFeedBack('')
    } catch (error) {
      toast.error(error?.message || 'Failed to update report')
    } finally {
      setOnSaveLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchText(query)
    }, 500),
    [],
  )

  const handleChange = (event) => {
    const query = event.target.value
    debouncedSearch(query)
  }

  const goToCreatorDetails = (item) => {
    const creatorId = item?.reportedId?._id || item?.reportedId?.id || item?._id
    if (!creatorId) return
    navigate(`/reports/${creatorId}`, {
      state: {
        creator: item?.reportedId,
        reportItem: item,
      },
    })
  }

  const filteredData = useMemo(() => {
    return (data || []).filter((item) => {
      const status = item?.ticketStatus?.toLowerCase?.() ?? ''
      const statusOk = statusFilter === 'all' ? true : status === statusFilter

      const itemDateRaw = item?.createdAt || item?.updatedAt
      if (!fromDate && !toDate) return statusOk
      if (!itemDateRaw) return false
      const itemDate = new Date(itemDateRaw)
      if (Number.isNaN(itemDate.getTime())) return false

      const fromOk = fromDate ? itemDate >= new Date(`${fromDate}T00:00:00`) : true
      const toOk = toDate ? itemDate <= new Date(`${toDate}T23:59:59`) : true
      return statusOk && fromOk && toOk
    })
  }, [data, statusFilter, fromDate, toDate])

  return (
    <CRow>
      {loading ? (
        <CRow className="justify-content-center align-items-center" style={{ height: '100vh' }}>
          <CCol xs="12" sm="8" md="6" lg="4">
            <CCardBody className="text-center">
              <CSpinner size="sm" style={{ width: '3rem', height: '3rem' }} />
            </CCardBody>
          </CCol>
        </CRow>
      ) : (
        <CCol xs>
          {filteredData?.length > 0 && (
            <CCardBody>
              <CSVLink
                filename={`reports-${formattedDate}.csv`}
                style={{
                  backgroundColor: '#35B7F6',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  textDecoration: 'none',
                }}
                data={filteredData}
                headers={headers}
              >
                Download
              </CSVLink>
            </CCardBody>
          )}

          <CCardBody>
            <div className="py-4">
              <CRow className="g-3 mb-3">
                <CCol md={4}>
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </CCol>
                <CCol md={4}>
                  <label className="form-label">From</label>
                  <CFormInput
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </CCol>
                <CCol md={4}>
                  <label className="form-label">To</label>
                  <CFormInput
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </CCol>
              </CRow>
              <CFormInput
                type="text"
                placeholder="Search Report by Reason"
                onChange={handleChange}
              />
            </div>

            {filteredData && filteredData.length > 0 ? (
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary">Creator</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">No. of reports</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Reasons</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Status</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredData.map((item, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>
                        <button
                          type="button"
                          onClick={() => goToCreatorDetails(item)}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: '#0d6efd',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            padding: 0,
                          }}
                        >
                          {item?.reportedId?.name ?? 'Loci_user'}
                        </button>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex justify-content-between text-nowrap">
                          <div>{item?.reportedId?.reportCount ?? 0}</div>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <div className="d-flex justify-content-between text-nowrap">
                          <div>
                            {(item?.reasons ?? []).join(', ').length > 30
                              ? (item?.reasons ?? []).join(', ').slice(0, 30) + '...'
                              : (item?.reasons ?? []).join(', ')}
                          </div>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex justify-content-between text-nowrap">
                          <div>{item?.ticketStatus?.toLowerCase?.() ?? ''}</div>
                        </div>
                      </CTableDataCell>

                      <CTableDataCell className="text-center">
                        <div className="d-flex justify-content-between text-nowrap">
                          <CDropdown alignment="end">
                            <CDropdownToggle
                              caret={false}
                              className="text-black border-3 rounded p-0"
                            >
                              <CIcon style={{ color: 'black' }} icon={cilOptions} />
                            </CDropdownToggle>
                            <CDropdownMenu>
                              <CDropdownItem onClick={() => onActionPerformed('REMOVE', item)}>
                                Remove
                              </CDropdownItem>
                              <CDropdownItem onClick={() => onActionPerformed('WARN', item)}>
                                Warn
                              </CDropdownItem>
                              <CDropdownItem onClick={() => onActionPerformed('BANNED', item)}>
                                Ban
                              </CDropdownItem>
                              <CDropdownItem onClick={() => onActionPerformed('UNBANNED', item)}>
                                UnBan
                              </CDropdownItem>
                            </CDropdownMenu>
                          </CDropdown>
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            ) : (
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell colSpan={6} className="text-center">
                      No data found
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            )}
          </CCardBody>

          {/* modal open */}
          <CModal
            backdrop="static"
            visible={visible}
            onClose={() => setVisible(false)}
            aria-labelledby="StaticBackdropExampleLabel"
          >
            <CModalHeader>
              <CModalTitle id="StaticBackdropExampleLabel">
                Please provide Feedback for this action {' ' + action.toLowerCase()}
              </CModalTitle>
            </CModalHeader>
            <div className="m-2">
              <CFormTextarea
                id="floatingTextarea"
                floatingLabel="Type here..."
                style={{ height: '400px' }}
                onChange={(e) => {
                  setFeedBack(e.target.value)
                }}
              ></CFormTextarea>
            </div>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setVisible(false)}>
                Close
              </CButton>

              <CButton
                color="primary"
                onClick={() => onSubmit()}
                disabled={!feedback?.trim()?.length > 0}
              >
                {!onSaveLoading ? (
                  'Save changes'
                ) : (
                  <CSpinner size="sm" style={{ width: '1rem', height: '1rem' }} />
                )}
              </CButton>
            </CModalFooter>
          </CModal>

          {/* pagination */}
          <div className="pagination-controls d-flex align-items-center justify-content-between my-3 ">
            <CButton
              color="primary"
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={totalPages === 0 || currentPage === 1}
              className="me-2"
            >
              Previous
            </CButton>
            <span className="mx-3">
              Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
            </span>
            <CButton
              color="primary"
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={totalPages === 0 || currentPage === totalPages}
              className="ms-2"
            >
              Next
            </CButton>
          </div>
        </CCol>
      )}
    </CRow>
  )
}

export default Reports
