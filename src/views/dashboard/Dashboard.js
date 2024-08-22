import React, { useState, useEffect, useCallback } from 'react'
import { CSVLink } from 'react-csv'

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
  CModalBody,
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
  CTooltip,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilOptions } from '@coreui/icons'
import { getAllReports, updateReportById } from '../../service/Reports'
import { toast } from 'react-toastify'
import { debounce } from 'lodash'
// TODO: loading ka kaam krna hy pori app may
const Dashboard = () => {
  const [searchText, setSearchText] = useState('')
  const [feedback, setFeedBack] = useState('')
  const [rowId, setRowId] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [onSaveLoading, setOnSaveLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [action, setAction] = useState('')
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  console.log('Pagination state')
  useEffect(() => {
    // Define an async function to fetch data
    const fetchData = async () => {
      try {
        // Replace with your API endpoint
        const response = await getAllReports(currentPage, searchText.trim())
        if (response?.data?.error) {
          toast.error(response?.data?.message)
          return
        }
        const result = response.data.data.items
        const pageInfo = response.data.data
        // response.data.data.page
        // response.data.data.limit
        // please work on pagination which comes on page and limit variables from API pagination through button

        console.log('result123', result)
        setData(result) // Update the state with the fetched data
        setTotalPages(pageInfo.totalPages)
      } catch (error) {
        toast.error(error)
        setError(error) // Update the state with the error
      } finally {
        setLoading(false) // Set loading to false when the request is complete
      }
    }

    fetchData() // Call the async function
  }, [currentPage, searchText])
  console.log('data11', rowId)

  const date = new Date()
  const formattedDate = date.toLocaleDateString()
  const headers = [
    { label: 'Creator', key: 'reportedId.name' },
    { label: 'No. of reports', key: 'reportedId.reportCount' },
    { label: 'Reasons', key: 'reasons' },
    { label: 'Link', key: 'postId.media.url' },
  ]

  const onActionPerformed = (action, item) => {
    setAction(action)
    setVisible(!visible)
    setRowId(item._id)
  }
  const onSubmit = async () => {
    try {
      setOnSaveLoading(true)
      const res = await updateReportById(rowId, feedback, action)
      console.log('res', res)
      setVisible(false)
    } catch (error) {
      console.log('error at 85', error)
      toast.error(error)
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
      console.log('Searching for:', query)
    }, 500),
    [],
  )
  const handleChange = (event) => {
    const query = event.target.value
    debouncedSearch(query) // Call the debounced function
  }

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
          <CCardBody>
            <div className="py-4">
              <CFormInput
                type="text"
                placeholder="Search Report by Reason"
                onChange={handleChange}
              />
            </div>
            {data && data.length > 0 ? (
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary">Creator</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">No. of reports</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Reasons</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Status</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Link</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {data.map((item, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>
                        <div>{item?.reportedId?.name}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex justify-content-between text-nowrap">
                          <div>{item?.reportedId.reportCount}</div>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CTooltip content={item.reasons.join(', ')}>
                          <div className="d-flex justify-content-between text-nowrap">
                            <div>
                              {item?.reasons.join(', ').length > 30
                                ? item.reasons.join(', ').slice(0, 30) + '...'
                                : item.reasons.join(', ')}
                            </div>
                          </div>
                        </CTooltip>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex justify-content-between text-nowrap">
                          <div>{item?.ticketStatus.toLowerCase()}</div>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {item.reportType === 'POST' ? (
                          <div className="d-flex justify-content-between text-nowrap">
                            <a
                              href={item?.postId?.media?.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              click here
                            </a>
                          </div>
                        ) : (
                          <div className="d-flex justify-content-between text-nowrap">-</div>
                        )}
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
                              <CDropdownItem
                                onClick={() => {
                                  onActionPerformed('REMOVE', item)
                                }}
                              >
                                Remove
                              </CDropdownItem>
                              <CDropdownItem
                                onClick={() => {
                                  onActionPerformed('WARN', item)
                                }}
                              >
                                Warn
                              </CDropdownItem>
                              <CDropdownItem
                                onClick={() => {
                                  onActionPerformed('BANNED', item)
                                }}
                              >
                                Ban
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
              disabled={currentPage === 1}
              className="me-2"
            >
              Previous
            </CButton>
            <span className="mx-3">
              Page {currentPage} of {totalPages}
            </span>
            <CButton
              color="primary"
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ms-2"
            >
              Next
            </CButton>
          </div>

          {/*  */}
          {data?.length > 0 && (
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
                data={data}
                headers={headers}
              >
                Download me
              </CSVLink>
            </CCardBody>
          )}
        </CCol>
      )}
    </CRow>
  )
}

export default Dashboard
