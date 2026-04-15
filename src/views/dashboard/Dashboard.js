import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CSpinner } from '@coreui/react'
import { CChartBar } from '@coreui/react-chartjs'
import { getDashboardMetrics, getDashboardCharts } from '../../service/Admin'

const CHART_COLORS = ['#3399ff', '#00cc99', '#ff6384', '#9966ff', '#ffcd56', '#ff9f40']

const Dashboard = () => {
  const [metricsLoading, setMetricsLoading] = useState(true)
  const [chartsLoading, setChartsLoading] = useState(true)
  const [metrics, setMetrics] = useState(null)
  const [chartData, setChartData] = useState(null)

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const res = await getDashboardMetrics()
        setMetrics(res?.data?.data ?? res?.data ?? null)
      } catch (e) {
        console.debug('dashboard metrics error', e)
      } finally {
        setMetricsLoading(false)
      }
    }
    loadMetrics()
  }, [])

  useEffect(() => {
    const loadCharts = async () => {
      try {
        const res = await getDashboardCharts()
        setChartData(res?.data?.data ?? res?.data ?? null)
      } catch (e) {
        console.debug('dashboard charts error', e)
      } finally {
        setChartsLoading(false)
      }
    }
    loadCharts()
  }, [])

  const statCards = metrics
    ? Object.entries(metrics).map(([key, value]) => ({
        label: key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (s) => s.toUpperCase())
          .trim(),
        value,
      }))
    : []

  const buildChartProps = (data) => {
    if (!data) return null
    const buckets = Array.isArray(data.buckets) ? data.buckets : []
    if (buckets.length === 0) return null

    const labels = buckets.map((b) => b.label)
    const metrics = [
      { key: 'postsCreatedCount', label: 'Posts Created' },
      { key: 'distinctPostAuthorsCount', label: 'Distinct Post Authors' },
      { key: 'commentsCreatedCount', label: 'Comments Created' },
      { key: 'distinctCommentAuthorsCount', label: 'Distinct Comment Authors' },
      { key: 'reactionsCreatedCount', label: 'Reactions' },
      { key: 'logoutEventsCount', label: 'Logouts' },
      { key: 'newUsersCount', label: 'New Users' },
      { key: 'deletedUsersCount', label: 'Deleted Users' },
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

  const chartProps = buildChartProps(chartData)

  return (
    <CRow>
      <CCol xs>
        {/* Overview stat cards */}
        <CCard className="mb-4">
          <CCardHeader>Overview</CCardHeader>
          <CCardBody>
            {metricsLoading ? (
              <div className="d-flex justify-content-center py-4">
                <CSpinner size="sm" style={{ width: '2rem', height: '2rem' }} />
              </div>
            ) : statCards.length === 0 ? (
              <div className="text-muted">No metrics available.</div>
            ) : (
              <CRow className="g-3">
                {statCards.map((m) => (
                  <CCol md={4} key={m.label}>
                    <CCard className="h-100">
                      <CCardBody>
                        <div className="text-muted small">{m.label}</div>
                        <div style={{ fontSize: 28, fontWeight: 700 }}>{m.value ?? '—'}</div>
                      </CCardBody>
                    </CCard>
                  </CCol>
                ))}
              </CRow>
            )}
          </CCardBody>
        </CCard>

        {/* Charts */}
        <CCard className="mb-4">
          <CCardHeader>Charts</CCardHeader>
          <CCardBody>
            {chartsLoading ? (
              <div className="d-flex justify-content-center py-4">
                <CSpinner size="sm" style={{ width: '2rem', height: '2rem' }} />
              </div>
            ) : !chartProps ? (
              <div className="text-muted">No chart data available.</div>
            ) : (
              <CChartBar
                data={chartProps}
                options={{
                  responsive: true,
                  plugins: { legend: { position: 'top' } },
                }}
              />
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Dashboard
