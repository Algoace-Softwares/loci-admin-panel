import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
} from '@coreui/react'
import { CChartBar } from '@coreui/react-chartjs'
import { getUserActivityById, getUserActivityByRange } from '../../service/Admin'

const RANGES = ['week', 'month', 'year']

const CHART_COLORS = ['#3399ff', '#00cc99', '#ff6384', '#9966ff', '#ffcd56', '#ff9f40']

const CreatorDetail = () => {
  const { creatorId } = useParams()
  const location = useLocation()
  const userFromState = location.state?.user ?? location.state?.creator

  const [mode, setMode] = useState('overview')
  const [overviewLoading, setOverviewLoading] = useState(true)
  const [chartLoading, setChartLoading] = useState(false)
  const [overview, setOverview] = useState(null)
  const [chartData, setChartData] = useState(null)
  const [range, setRange] = useState('week')

  const userName = userFromState?.name ?? 'User'

  // Load overview (all-time activity)
  useEffect(() => {
    const load = async () => {
      try {
        setOverviewLoading(true)
        const res = await getUserActivityById(creatorId)
        const data = res?.data?.data ?? res?.data ?? null
        setOverview(data)
      } catch (e) {
        console.debug('user activity overview error', e)
      } finally {
        setOverviewLoading(false)
      }
    }
    load()
  }, [creatorId])

  // Load chart data when on charts tab or range changes
  useEffect(() => {
    if (mode !== 'chart') return
    const load = async () => {
      try {
        setChartLoading(true)
        const res = await getUserActivityByRange(creatorId, range)
        const data = res?.data?.data ?? res?.data ?? null
        setChartData(data)
      } catch (e) {
        console.debug('user activity range error', e)
      } finally {
        setChartLoading(false)
      }
    }
    load()
  }, [creatorId, mode, range])

  const overviewCards = overview
    ? Object.entries(overview)
        .filter(([key]) => !/(^_?id$|Id$)/i.test(key))
        .map(([key, value]) => ({
          label: key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (s) => s.toUpperCase())
            .trim(),
          value,
        }))
    : []

  // Build chart datasets from buckets array in chartData
  const buildChartProps = () => {
    if (!chartData) return null
    const buckets = Array.isArray(chartData.buckets) ? chartData.buckets : []
    if (buckets.length === 0) return null

    const labels = buckets.map((b) => b.label)
    const metrics = [
      { key: 'postsCount', label: 'Posts' },
      { key: 'commentsMadeCount', label: 'Comments Made' },
      { key: 'commentsOnUserPostsCount', label: 'Comments on Posts' },
      { key: 'reactionsMadeCount', label: 'Reactions Made' },
      { key: 'reactionsOnUserPostsCount', label: 'Reactions on Posts' },
      { key: 'logoutEventsCount', label: 'Logouts' },
    ]

    return {
      labels,
      datasets: metrics.map((m, i) => ({
        label: m.label,
        data: buckets.map((b) => b[m.key] ?? 0),
        backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
      })),
    }
  }

  const chartProps = buildChartProps()

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <div>{userName} — Details</div>
            <div className="d-flex gap-2 mt-2">
              <CButton
                color={mode === 'overview' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setMode('overview')}
              >
                Overview
              </CButton>
              <CButton
                color={mode === 'chart' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setMode('chart')}
              >
                Charts
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            {mode === 'overview' ? (
              overviewLoading ? (
                <div className="d-flex justify-content-center py-5">
                  <CSpinner size="sm" style={{ width: '3rem', height: '3rem' }} />
                </div>
              ) : overviewCards.length === 0 ? (
                <div className="text-muted">No activity data available.</div>
              ) : (
                <CRow className="g-3">
                  {overviewCards.map((card) => (
                    <CCol md={4} key={card.label}>
                      <CCard className="h-100">
                        <CCardBody>
                          <div className="text-muted small">{card.label}</div>
                          <div style={{ fontSize: 28, fontWeight: 700 }}>{card.value ?? '—'}</div>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  ))}
                </CRow>
              )
            ) : (
              <>
                {/* Range filter buttons */}
                <div className="d-flex gap-2 mb-4">
                  {RANGES.map((r) => (
                    <CButton
                      key={r}
                      color={range === r ? 'primary' : 'secondary'}
                      variant={range === r ? undefined : 'outline'}
                      size="sm"
                      onClick={() => setRange(r)}
                    >
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </CButton>
                  ))}
                </div>

                {chartLoading ? (
                  <div className="d-flex justify-content-center py-5">
                    <CSpinner size="sm" style={{ width: '3rem', height: '3rem' }} />
                  </div>
                ) : !chartProps ? (
                  <div className="text-muted">No chart data available for this range.</div>
                ) : (
                  <CChartBar
                    data={chartProps}
                    options={{
                      responsive: true,
                      plugins: { legend: { position: 'top' } },
                    }}
                  />
                )}
              </>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default CreatorDetail
