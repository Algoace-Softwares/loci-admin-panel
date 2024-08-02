import React from 'react'
import { CSVLink } from 'react-csv'

import {
  CCardBody,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilOptions } from '@coreui/icons'

const Dashboard = () => {
  const example = [
    {
      creator: 'user1',
      no_of_reports: 5,
      reasons: 'spam, offensive language',
      link: 'http://example.com/1',
    },
    {
      creator: 'user2',
      no_of_reports: 3,
      reasons: 'harassment, spam',
      link: 'http://example.com/2',
    },
    {
      creator: 'user3',
      no_of_reports: 4,
      reasons: 'false information, offensive',
      link: 'http://example.com/3',
    },
    { creator: 'user4', no_of_reports: 2, reasons: 'spam', link: 'http://example.com/4' },
    {
      creator: 'user5',
      no_of_reports: 6,
      reasons: 'offensive language, harassment',
      link: 'http://example.com/5',
    },
    {
      creator: 'user6',
      no_of_reports: 1,
      reasons: 'false information',
      link: 'http://example.com/6',
    },
    {
      creator: 'user7',
      no_of_reports: 8,
      reasons: 'harassment, spam, offensive',
      link: 'http://example.com/7',
    },
    {
      creator: 'user8',
      no_of_reports: 2,
      reasons: 'offensive language',
      link: 'http://example.com/8',
    },
    {
      creator: 'user9',
      no_of_reports: 7,
      reasons: 'false information, spam',
      link: 'http://example.com/9',
    },
    {
      creator: 'user10',
      no_of_reports: 3,
      reasons: 'offensive language, harassment',
      link: 'http://example.com/10',
    },
    {
      creator: 'user11',
      no_of_reports: 4,
      reasons: 'spam, offensive',
      link: 'http://example.com/11',
    },
    {
      creator: 'user12',
      no_of_reports: 5,
      reasons: 'harassment, false information',
      link: 'http://example.com/12',
    },
    {
      creator: 'user13',
      no_of_reports: 6,
      reasons: 'spam, offensive language',
      link: 'http://example.com/13',
    },
    { creator: 'user14', no_of_reports: 2, reasons: 'harassment', link: 'http://example.com/14' },
    { creator: 'user15', no_of_reports: 1, reasons: 'spam', link: 'http://example.com/15' },
    {
      creator: 'user16',
      no_of_reports: 3,
      reasons: 'false information',
      link: 'http://example.com/16',
    },
    {
      creator: 'user17',
      no_of_reports: 7,
      reasons: 'offensive language, harassment',
      link: 'http://example.com/17',
    },
    {
      creator: 'user18',
      no_of_reports: 5,
      reasons: 'spam, harassment',
      link: 'http://example.com/18',
    },
    {
      creator: 'user19',
      no_of_reports: 2,
      reasons: 'false information',
      link: 'http://example.com/19',
    },
    {
      creator: 'user20',
      no_of_reports: 6,
      reasons: 'offensive language, spam',
      link: 'http://example.com/20',
    },
    {
      creator: 'user21',
      no_of_reports: 4,
      reasons: 'harassment, false information',
      link: 'http://example.com/21',
    },
    {
      creator: 'user22',
      no_of_reports: 3,
      reasons: 'spam, offensive',
      link: 'http://example.com/22',
    },
    { creator: 'user23', no_of_reports: 1, reasons: 'harassment', link: 'http://example.com/23' },
    {
      creator: 'user24',
      no_of_reports: 7,
      reasons: 'offensive language, false information',
      link: 'http://example.com/24',
    },
    {
      creator: 'user25',
      no_of_reports: 5,
      reasons: 'spam, harassment',
      link: 'http://example.com/25',
    },
    {
      creator: 'user26',
      no_of_reports: 4,
      reasons: 'false information, offensive',
      link: 'http://example.com/26',
    },
    { creator: 'user27', no_of_reports: 2, reasons: 'spam', link: 'http://example.com/27' },
    {
      creator: 'user28',
      no_of_reports: 6,
      reasons: 'harassment, offensive language',
      link: 'http://example.com/28',
    },
    {
      creator: 'user29',
      no_of_reports: 8,
      reasons: 'false information, spam',
      link: 'http://example.com/29',
    },
    {
      creator: 'user30',
      no_of_reports: 3,
      reasons: 'offensive language, harassment',
      link: 'http://example.com/30',
    },
    {
      creator: 'user31',
      no_of_reports: 5,
      reasons: 'spam, offensive',
      link: 'http://example.com/31',
    },
    {
      creator: 'user32',
      no_of_reports: 4,
      reasons: 'harassment, false information',
      link: 'http://example.com/32',
    },
    {
      creator: 'user33',
      no_of_reports: 2,
      reasons: 'spam, offensive language',
      link: 'http://example.com/33',
    },
    {
      creator: 'user34',
      no_of_reports: 7,
      reasons: 'harassment, false information',
      link: 'http://example.com/34',
    },
    {
      creator: 'user35',
      no_of_reports: 1,
      reasons: 'offensive language',
      link: 'http://example.com/35',
    },
    {
      creator: 'user36',
      no_of_reports: 6,
      reasons: 'spam, false information',
      link: 'http://example.com/36',
    },
    {
      creator: 'user37',
      no_of_reports: 4,
      reasons: 'harassment, offensive language',
      link: 'http://example.com/37',
    },
    {
      creator: 'user38',
      no_of_reports: 3,
      reasons: 'spam, false information',
      link: 'http://example.com/38',
    },
    {
      creator: 'user39',
      no_of_reports: 2,
      reasons: 'harassment, offensive language',
      link: 'http://example.com/39',
    },
    {
      creator: 'user40',
      no_of_reports: 8,
      reasons: 'spam, false information',
      link: 'http://example.com/40',
    },
    {
      creator: 'user41',
      no_of_reports: 7,
      reasons: 'harassment, offensive language',
      link: 'http://example.com/41',
    },
    {
      creator: 'user42',
      no_of_reports: 1,
      reasons: 'false information',
      link: 'http://example.com/42',
    },
    {
      creator: 'user43',
      no_of_reports: 6,
      reasons: 'spam, offensive language',
      link: 'http://example.com/43',
    },
    {
      creator: 'user44',
      no_of_reports: 5,
      reasons: 'harassment, false information',
      link: 'http://example.com/44',
    },
    {
      creator: 'user45',
      no_of_reports: 3,
      reasons: 'spam, offensive language',
      link: 'http://example.com/45',
    },
    { creator: 'user46', no_of_reports: 2, reasons: 'harassment', link: 'http://example.com/46' },
    {
      creator: 'user47',
      no_of_reports: 4,
      reasons: 'false information',
      link: 'http://example.com/47',
    },
    {
      creator: 'user48',
      no_of_reports: 8,
      reasons: 'spam, offensive language',
      link: 'http://example.com/48',
    },
    {
      creator: 'user49',
      no_of_reports: 5,
      reasons: 'harassment, false information',
      link: 'http://example.com/49',
    },
    {
      creator: 'user50',
      no_of_reports: 3,
      reasons: 'spam, offensive language',
      link: 'http://example.com/50',
    },
  ]
  const date = new Date()
  const formattedDate = date.toLocaleDateString()
  const headers = [
    { label: 'Creator', key: 'creator' },
    { label: 'No. of reports', key: 'no_of_reports' },
    { label: 'Reasons', key: 'reasons' },
    { label: 'Link', key: 'link' },
  ]

  return (
    <CRow>
      <CCol xs>
        <CCardBody>
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
              {example.map((item, index) => (
                <CTableRow v-for="item in tableItems" key={index}>
                  <CTableDataCell>
                    <div>{item.creator}</div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex justify-content-between text-nowrap">
                      <div>{item.no_of_reports}</div>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <div className="d-flex justify-content-between text-nowrap">
                      <div>{item.reasons}</div>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <div className="d-flex justify-content-between text-nowrap">
                      <a href={item.link} target="_blank" rel="noopener noreferrer">
                        click here
                      </a>
                    </div>
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
                          <CDropdownItem onClick={() => console.log('3')}>Deactivate</CDropdownItem>
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
                backgroundColor: '#AE13FE',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                textDecoration: 'none',
              }}
              data={example}
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
