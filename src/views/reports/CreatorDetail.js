import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CSpinner } from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import { getCreatorOverviewStats, getCreatorTimeseriesStats } from '../../service/Metrics'

const CreatorDetail = () => {
  const { creatorId } = useParams()
  const location = useLocation()
  const creatorFromState = location.state?.creator
  const [mode, setMode] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [overview, setOverview] = useState({})
  const [series, setSeries] = useState({
    postingActivity: [],
    commentingActivity: [],
    engagingPosts: [],
    overallActivity: [],
  })

  const creatorName = creatorFromState?.name || 'Creator'

  const normalizeSeries = (arr) =>
    Array.isArray(arr)
      ? arr.map((item) => ({
          x: item?.date ?? item?.label ?? item?.x ?? '',
          y: item?.count ?? item?.value ?? item?.y ?? 0,
        }))
      : []

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [overviewRes, timeseriesRes] = await Promise.all([
          getCreatorOverviewStats(creatorId),
          getCreatorTimeseriesStats(creatorId, { interval: 'day' }),
        ])

        const overviewData = overviewRes?.data?.data ?? overviewRes?.data ?? {}
        setOverview(overviewData || {})

        const seriesData = timeseriesRes?.data?.data ?? timeseriesRes?.data ?? {}
        setSeries({
          postingActivity: normalizeSeries(seriesData?.postingActivity),
          commentingActivity: normalizeSeries(seriesData?.commentingActivity),
          engagingPosts: normalizeSeries(seriesData?.engagingPosts),
          overallActivity: normalizeSeries(seriesData?.overallActivity),
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [creatorId])

  const cards = useMemo(
    () => [
      {
        label: 'Posting Activity',
        value: overview?.postingActivity ?? overview?.postsCount ?? '—',
      },
      {
        label: 'Commenting Activity',
        value: overview?.commentingActivity ?? overview?.commentsCount ?? '—',
      },
      { label: 'Posts Engaging', value: overview?.postsEngaging ?? overview?.engagedPosts ?? '—' },
      {
        label: 'Overall Activity Score',
        value: overview?.overallActivity ?? overview?.overallScore ?? '—',
      },
      { label: 'Followers', value: overview?.followers ?? '—' },
      { label: 'Following', value: overview?.following ?? '—' },
    ],
    [overview],
  )

  const renderLineChart = (title, dataPoints, color) => (
    <CCol md={6}>
      <div className="text-muted small mb-2">{title}</div>
      <CChartLine
        data={{
          labels: dataPoints.map((p) => p.x),
          datasets: [
            {
              label: title,
              data: dataPoints.map((p) => p.y),
              borderColor: color,
              backgroundColor: `${color}33`,
              fill: true,
              tension: 0.3,
            },
          ],
        }}
      />
    </CCol>
  )

  if (loading) {
    return (
      <CRow className="justify-content-center align-items-center" style={{ height: '60vh' }}>
        <CSpinner size="sm" style={{ width: '3rem', height: '3rem' }} />
      </CRow>
    )
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            {creatorName} - Details
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
              <CRow className="g-3">
                {cards.map((card) => (
                  <CCol md={4} key={card.label}>
                    <CCard className="h-100">
                      <CCardBody>
                        <div className="text-muted small">{card.label}</div>
                        <div style={{ fontSize: 28, fontWeight: 700 }}>{card.value}</div>
                      </CCardBody>
                    </CCard>
                  </CCol>
                ))}
              </CRow>
            ) : (
              <CRow className="g-4">
                {renderLineChart('Posting Activity', series.postingActivity, '#3399ff')}
                {renderLineChart('Commenting Activity', series.commentingActivity, '#00cc99')}
                {renderLineChart('Posts Engaging', series.engagingPosts, '#ff6384')}
                {renderLineChart('Overall Activity', series.overallActivity, '#9966ff')}
              </CRow>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default CreatorDetail
