import React, { useMemo } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

const ReportCreatorDetail = () => {
  const { creatorId } = useParams()
  const location = useLocation()
  const creator = location.state?.creator
  const reportItem = location.state?.reportItem

  const creatorName = creator?.name ?? reportItem?.reportedId?.name ?? 'Creator'
  const reportCount = creator?.reportCount ?? reportItem?.reportedId?.reportCount ?? '—'

  const reasons = useMemo(() => {
    const arr = reportItem?.reasons
    if (!Array.isArray(arr)) return []
    // count occurrences
    const map = new Map()
    arr.forEach((r) => {
      const key = String(r)
      map.set(key, (map.get(key) || 0) + 1)
    })
    return Array.from(map.entries()).map(([reason, count]) => ({ reason, count }))
  }, [reportItem])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>{creatorName} - Reports Details</CCardHeader>
          <CCardBody>
            <CRow className="g-3 mb-3">
              <CCol md={4}>
                <div className="text-muted small">Creator ID</div>
                <div style={{ fontWeight: 700 }}>{creatorId}</div>
              </CCol>
              <CCol md={4}>
                <div className="text-muted small">Total reports</div>
                <div style={{ fontWeight: 700 }}>{reportCount}</div>
              </CCol>
              <CCol md={4}>
                <div className="text-muted small">Current status</div>
                <div style={{ fontWeight: 700 }}>
                  {reportItem?.ticketStatus?.toLowerCase?.() ?? '—'}
                </div>
              </CCol>
            </CRow>

            <CCard className="mb-0">
              <CCardHeader>Reasons</CCardHeader>
              <CCardBody>
                {reasons.length === 0 ? (
                  <div className="text-muted">No reasons available (backend support needed).</div>
                ) : (
                  <CTable align="middle" className="mb-0 border" hover responsive>
                    <CTableHead className="text-nowrap">
                      <CTableRow>
                        <CTableHeaderCell className="bg-body-tertiary">Reason</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary">Count</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {reasons.map((r) => (
                        <CTableRow key={r.reason}>
                          <CTableDataCell>{r.reason}</CTableDataCell>
                          <CTableDataCell>{r.count}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                )}
              </CCardBody>
            </CCard>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ReportCreatorDetail
