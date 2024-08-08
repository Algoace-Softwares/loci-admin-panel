import React, { useState, useEffect } from 'react'
import { CSVLink } from 'react-csv'

import {
  CCardBody,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFormInput,
  CRow,
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
import { getAllReports } from '../../service/Reports'
import { toast } from 'react-toastify'
// TODO: loading ka kaam krna hy pori app may
const Dashboard = () => {
  const [searchText, setSearchText] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    // Define an async function to fetch data
    const fetchData = async () => {
      try {
        // Replace with your API endpoint
        const response = await getAllReports()
        if (response?.data?.error) {
          toast.error(response?.data?.message)
          return
        }
        const result = response.data.data
        setData(result) // Update the state with the fetched data
      } catch (error) {
        toast.error(error)
        setError(error) // Update the state with the error
      } finally {
        setLoading(false) // Set loading to false when the request is complete
      }
    }

    fetchData() // Call the async function
  }, [])
  console.log('data11', data)

  const date = new Date()
  const formattedDate = date.toLocaleDateString()
  const headers = [
    { label: 'Creator', key: 'reportedId.name' },
    { label: 'No. of reports', key: 'reportCount' },
    { label: 'Reasons', key: 'reasons' },
    { label: 'Link', key: 'postId.media.url' },
  ]
  console.log('searchText', searchText)
  return (
    <CRow>
      <CCol xs>
        <CCardBody>
          <div className="py-4">
            <CFormInput
              type="text"
              placeholder="Search report"
              aria-label="default input example"
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead className="text-nowrap">
              <CTableRow>
                <CTableHeaderCell className="bg-body-tertiary">Creator</CTableHeaderCell>

                <CTableHeaderCell className="bg-body-tertiary">No. of reports</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary ">Reasons</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary">Link</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {data.map((item, index) => (
                <CTableRow v-for="item in tableItems" key={index}>
                  <CTableDataCell>
                    <div>{item?.reportedId?.name}</div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex justify-content-between text-nowrap">
                      <div>{item?.reportCount}</div>
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
                        <CDropdownToggle caret={false} className="text-black border-3 rounded p-0">
                          <CIcon style={{ color: 'black' }} icon={cilOptions} />
                        </CDropdownToggle>
                        <CDropdownMenu>
                          <CDropdownItem onClick={() => console.log('1')}>Remove</CDropdownItem>
                          <CDropdownItem onClick={() => console.log('2')}>Warn</CDropdownItem>
                          <CDropdownItem onClick={() => console.log('3')}>Ban</CDropdownItem>
                        </CDropdownMenu>
                      </CDropdown>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
        {/*  */}
        <CCardBody className="py-3">
          <div onClick={() => console.log('asd')}>
            {/* <CButton></CButton> */}
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
          </div>
        </CCardBody>
      </CCol>
    </CRow>
  )
}

export default Dashboard
