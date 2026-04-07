import React, { useEffect, useCallback, useState } from 'react'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import {
  getAccountDeletionsCount,
  getAccountDeletionsTimeseries,
  getLogoutEventsCount,
  getLogoutEventsTimeseries,
  getOnlineUsersCount,
  getUsersWithCommentsCount,
  getUsersWithCommentsTimeseries,
  getUsersWithPostsCount,
  getUsersWithPostsTimeseries,
  searchUserActivity,
  getTotalRegisteredUsers,
} from '../../service/Metrics'
import { debounce } from 'lodash'
import { CChartLine } from '@coreui/react-chartjs'
// TODO: loading ka kaam krna hy pori app may
const Dashboard = () => {
  // ---- Metrics dashboard state (11 features) ----
  const [metricsLoading, setMetricsLoading] = useState(false)
  const [metricsError, setMetricsError] = useState('')

  const [onlineUsers, setOnlineUsers] = useState(null)
  const [usersWithPosts, setUsersWithPosts] = useState(null)
  const [usersWithComments, setUsersWithComments] = useState(null)
  const [totalRegisteredUsers, setTotalRegisteredUsers] = useState(null)
  const [accountDeletions, setAccountDeletions] = useState(null)
  const [logoutEvents, setLogoutEvents] = useState(null)

  const [postsTimeseries, setPostsTimeseries] = useState([])
  const [commentsTimeseries, setCommentsTimeseries] = useState([])
  const [deletionsTimeseries, setDeletionsTimeseries] = useState([])
  const [logoutTimeseries, setLogoutTimeseries] = useState([])

  const [activitySearchText, setActivitySearchText] = useState('')
  const [activitySearchResults, setActivitySearchResults] = useState([])
  const [activitySearchLoading, setActivitySearchLoading] = useState(false)
  // const [activitySearchLoading, setActivitySearchLoading] = useState(false)

  // Derived analytical metrics
  const [engagementRate, setEngagementRate] = useState(null)
  const [commentsPerPostingUser, setCommentsPerPostingUser] = useState(null)
  const [postsTrend, setPostsTrend] = useState(null)
  const [commentsTrend, setCommentsTrend] = useState(null)
  const [deletionsTrend, setDeletionsTrend] = useState(null)
  const [logoutsTrend, setLogoutsTrend] = useState(null)

  const buildMetricsParams = () => ({ interval: 'day' })

  const extractCount = (res) =>
    res?.data?.data?.count ??
    res?.data?.count ??
    res?.data?.data?.total ??
    res?.data?.total ??
    res?.data?.data?.onlineUsers ??
    res?.data?.onlineUsers ??
    null

  const extractPoints = (res) =>
    res?.data?.data?.points ?? res?.data?.points ?? res?.data?.data ?? res?.data ?? []

  // Load count metrics (overview)
  useEffect(() => {
    const loadOverview = async () => {
      try {
        setMetricsLoading(true)
        setMetricsError('')
        const params = buildMetricsParams()

        const [onlineRes, postedRes, commentedRes, registeredRes, deletionsRes, logoutsRes] =
          await Promise.all([
            getOnlineUsersCount(params),
            getUsersWithPostsCount(params),
            getUsersWithCommentsCount(params),
            getTotalRegisteredUsers(params),
            getAccountDeletionsCount(params),
            getLogoutEventsCount(params),
          ])

        setOnlineUsers(extractCount(onlineRes))
        setUsersWithPosts(extractCount(postedRes))
        setUsersWithComments(extractCount(commentedRes))
        setTotalRegisteredUsers(extractCount(registeredRes))
        setAccountDeletions(extractCount(deletionsRes))
        setLogoutEvents(extractCount(logoutsRes))
      } catch (e) {
        console.debug('metrics overview error', e)
        setMetricsError('Failed to load metrics')
      } finally {
        setMetricsLoading(false)
      }
    }
    loadOverview()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Poll online users for dynamic updates
  useEffect(() => {
    let intervalId
    const poll = async () => {
      try {
        const params = buildMetricsParams()
        const res = await getOnlineUsersCount(params)
        setOnlineUsers(extractCount(res))
      } catch (e) {
        console.debug('online users polling error', e)
      }
    }
    poll()
    intervalId = setInterval(poll, 5000)
    return () => clearInterval(intervalId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load charts (timeseries)
  useEffect(() => {
    const loadCharts = async () => {
      try {
        const params = buildMetricsParams()
        const [postsRes, commentsRes, deletionsRes, logoutsRes] = await Promise.all([
          getUsersWithPostsTimeseries(params),
          getUsersWithCommentsTimeseries(params),
          getAccountDeletionsTimeseries(params),
          getLogoutEventsTimeseries(params),
        ])
        setPostsTimeseries(extractPoints(postsRes) || [])
        setCommentsTimeseries(extractPoints(commentsRes) || [])
        setDeletionsTimeseries(extractPoints(deletionsRes) || [])
        setLogoutTimeseries(extractPoints(logoutsRes) || [])
      } catch (e) {
        console.debug('metrics charts error', e)
      }
    }
    loadCharts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Compute analytical insights from counts + timeseries
  useEffect(() => {
    // Simple engagement rate: fraction of registered users who posted
    if (totalRegisteredUsers && usersWithPosts != null) {
      const rate = totalRegisteredUsers > 0 ? (usersWithPosts / totalRegisteredUsers) * 100 : null
      setEngagementRate(rate)
    } else {
      setEngagementRate(null)
    }

    // Comments per posting user
    if (usersWithPosts && usersWithComments != null) {
      const ratio = usersWithPosts > 0 ? usersWithComments / usersWithPosts : null
      setCommentsPerPostingUser(ratio)
    } else {
      setCommentsPerPostingUser(null)
    }

    const computeTrend = (series) => {
      if (!Array.isArray(series) || series.length < 2) return null
      const clean = series.filter((p) => p && (p.count != null || p.value != null))
      if (clean.length < 2) return null
      const curr = clean[clean.length - 1]
      const prev = clean[clean.length - 2]
      const currVal = curr.count ?? curr.value ?? 0
      const prevVal = prev.count ?? prev.value ?? 0
      if (prevVal === 0 && currVal === 0) return { direction: 'flat', percent: 0 }
      if (prevVal === 0) {
        return { direction: 'up', percent: 100 }
      }
      const diff = currVal - prevVal
      const pct = (diff / prevVal) * 100
      let direction = 'flat'
      if (pct > 5) direction = 'up'
      else if (pct < -5) direction = 'down'
      return { direction, percent: pct }
    }

    setPostsTrend(computeTrend(postsTimeseries))
    setCommentsTrend(computeTrend(commentsTimeseries))
    setDeletionsTrend(computeTrend(deletionsTimeseries))
    setLogoutsTrend(computeTrend(logoutTimeseries))
  }, [
    totalRegisteredUsers,
    usersWithPosts,
    usersWithComments,
    postsTimeseries,
    commentsTimeseries,
    deletionsTimeseries,
    logoutTimeseries,
  ])

  const debouncedActivitySearch = useCallback(
    debounce(async (query, params) => {
      try {
        setActivitySearchLoading(true)
        const res = await searchUserActivity({ q: query, ...params })
        const items =
          res?.data?.data?.items ?? res?.data?.items ?? res?.data?.data ?? res?.data ?? []
        setActivitySearchResults(Array.isArray(items) ? items : [])
      } catch (e) {
        console.debug('activity search error', e)
        setActivitySearchResults([])
      } finally {
        setActivitySearchLoading(false)
      }
    }, 600),
    [],
  )

  useEffect(() => {
    const q = activitySearchText.trim()
    if (!q) {
      setActivitySearchResults([])
      debouncedActivitySearch.cancel?.()
      return
    }
    const params = buildMetricsParams()
    debouncedActivitySearch(q, params)
    return () => debouncedActivitySearch.cancel?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activitySearchText, debouncedActivitySearch])

  return (
    <CRow>
      <CCol xs>
        {/* ---- Metrics Dashboard (11 features) ---- */}
        <CCard className="mb-4">
          <CCardHeader>Overview</CCardHeader>
          <CCardBody>
            <CRow className="g-3">
              {[
                { label: 'Users Online', value: onlineUsers },
                { label: 'Users Who Posted', value: usersWithPosts },
                { label: 'Users Who Commented', value: usersWithComments },
                { label: 'Registered Users', value: totalRegisteredUsers },
                { label: 'Account Deletions', value: accountDeletions },
                { label: 'Logout Events', value: logoutEvents },
              ].map((m) => (
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
          </CCardBody>
        </CCard>

        <CCard className="mb-4">
          <CCardHeader>Analytics</CCardHeader>
          <CCardBody>
            <ul className="mb-0">
              <li>
                <strong>Engagement rate:</strong>{' '}
                {engagementRate != null ? `${engagementRate.toFixed(1)}%` : '—'}{' '}
                {engagementRate != null && totalRegisteredUsers ? (
                  <span className="text-muted">
                    ({usersWithPosts ?? 0} of {totalRegisteredUsers ?? 0} users posted in this
                    period)
                  </span>
                ) : null}
              </li>
              <li>
                <strong>Comments per posting user:</strong>{' '}
                {commentsPerPostingUser != null ? commentsPerPostingUser.toFixed(2) : '—'}
              </li>
              <li>
                <strong>Posting trend:</strong>{' '}
                {postsTrend ? (
                  <span
                    className={
                      postsTrend.direction === 'up'
                        ? 'text-success'
                        : postsTrend.direction === 'down'
                          ? 'text-danger'
                          : 'text-muted'
                    }
                  >
                    {postsTrend.direction === 'up'
                      ? 'Increasing'
                      : postsTrend.direction === 'down'
                        ? 'Decreasing'
                        : 'Flat'}{' '}
                    ({postsTrend.percent.toFixed(1)}%)
                  </span>
                ) : (
                  'Not enough data'
                )}
              </li>
              <li>
                <strong>Comment activity trend:</strong>{' '}
                {commentsTrend ? (
                  <span
                    className={
                      commentsTrend.direction === 'up'
                        ? 'text-success'
                        : commentsTrend.direction === 'down'
                          ? 'text-danger'
                          : 'text-muted'
                    }
                  >
                    {commentsTrend.direction === 'up'
                      ? 'Increasing'
                      : commentsTrend.direction === 'down'
                        ? 'Decreasing'
                        : 'Flat'}{' '}
                    ({commentsTrend.percent.toFixed(1)}%)
                  </span>
                ) : (
                  'Not enough data'
                )}
              </li>
              <li>
                <strong>Account deletions trend:</strong>{' '}
                {deletionsTrend ? (
                  <span
                    className={
                      deletionsTrend.direction === 'up'
                        ? 'text-danger'
                        : deletionsTrend.direction === 'down'
                          ? 'text-success'
                          : 'text-muted'
                    }
                  >
                    {deletionsTrend.direction === 'up'
                      ? 'Rising deletions'
                      : deletionsTrend.direction === 'down'
                        ? 'Fewer deletions'
                        : 'Stable'}{' '}
                    ({deletionsTrend.percent.toFixed(1)}%)
                  </span>
                ) : (
                  'Not enough data'
                )}
              </li>
              <li>
                <strong>Logout activity trend:</strong>{' '}
                {logoutsTrend ? (
                  <span
                    className={
                      logoutsTrend.direction === 'up'
                        ? 'text-warning'
                        : logoutsTrend.direction === 'down'
                          ? 'text-success'
                          : 'text-muted'
                    }
                  >
                    {logoutsTrend.direction === 'up'
                      ? 'More logouts'
                      : logoutsTrend.direction === 'down'
                        ? 'Fewer logouts'
                        : 'Stable'}{' '}
                    ({logoutsTrend.percent.toFixed(1)}%)
                  </span>
                ) : (
                  'Not enough data'
                )}
              </li>
            </ul>
          </CCardBody>
        </CCard>

        <CCard className="mb-4">
          <CCardHeader>Users Activity Trends</CCardHeader>
          <CCardBody>
            <CRow className="g-4">
              <CCol md={6}>
                <div className="text-muted small mb-2">Users Who Posted</div>
                <CChartLine
                  data={{
                    labels: (postsTimeseries || []).map((p) => p?.date ?? p?.label ?? ''),
                    datasets: [
                      {
                        label: 'Users who posted',
                        data: (postsTimeseries || []).map((p) => p?.count ?? p?.value ?? 0),
                        borderColor: '#3399ff',
                        backgroundColor: 'rgba(51, 153, 255, 0.2)',
                        fill: true,
                        tension: 0.3,
                      },
                    ],
                  }}
                />
              </CCol>

              <CCol md={6}>
                <div className="text-muted small mb-2">Users Who Commented</div>
                <CChartLine
                  data={{
                    labels: (commentsTimeseries || []).map((p) => p?.date ?? p?.label ?? ''),
                    datasets: [
                      {
                        label: 'Users who commented',
                        data: (commentsTimeseries || []).map((p) => p?.count ?? p?.value ?? 0),
                        borderColor: '#00cc99',
                        backgroundColor: 'rgba(0, 204, 153, 0.2)',
                        fill: true,
                        tension: 0.3,
                      },
                    ],
                  }}
                />
              </CCol>
            </CRow>

            <CRow className="g-4 mt-1">
              <CCol md={6}>
                <div className="text-muted small mb-2">Account Deletions</div>
                <CChartLine
                  data={{
                    labels: (deletionsTimeseries || []).map((p) => p?.date ?? p?.label ?? ''),
                    datasets: [
                      {
                        label: 'Account deletions',
                        data: (deletionsTimeseries || []).map((p) => p?.count ?? p?.value ?? 0),
                        borderColor: '#ff6384',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: true,
                        tension: 0.3,
                      },
                    ],
                  }}
                />
              </CCol>

              <CCol md={6}>
                <div className="text-muted small mb-2">User Logouts</div>
                <CChartLine
                  data={{
                    labels: (logoutTimeseries || []).map((p) => p?.date ?? p?.label ?? ''),
                    datasets: [
                      {
                        label: 'User logouts',
                        data: (logoutTimeseries || []).map((p) => p?.count ?? p?.value ?? 0),
                        borderColor: '#9966ff',
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        fill: true,
                        tension: 0.3,
                      },
                    ],
                  }}
                />
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>

        {activitySearchText.trim() && (
          <CCard className="mb-4">
            <CCardHeader>
              Activity Search Results
              {activitySearchLoading && (
                <span className="ms-2">
                  <CSpinner size="sm" />
                </span>
              )}
            </CCardHeader>
            <CCardBody>
              {Array.isArray(activitySearchResults) && activitySearchResults.length === 0 ? (
                <div className="text-muted">No results found.</div>
              ) : (
                <CTable align="middle" className="mb-0 border" hover responsive>
                  <CTableHead className="text-nowrap">
                    <CTableRow>
                      <CTableHeaderCell className="bg-body-tertiary">ID</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">User</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Type</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Description</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Date</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {activitySearchResults.map((item) => (
                      <CTableRow key={item?.id ?? item?._id ?? JSON.stringify(item)}>
                        <CTableDataCell>{item?.id ?? item?._id ?? '—'}</CTableDataCell>
                        <CTableDataCell>{item?.userId ?? item?.user ?? '—'}</CTableDataCell>
                        <CTableDataCell>{item?.type ?? item?.activityType ?? '—'}</CTableDataCell>
                        <CTableDataCell>{item?.description ?? item?.message ?? '—'}</CTableDataCell>
                        <CTableDataCell>{item?.date ?? item?.createdAt ?? '—'}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        )}
      </CCol>
    </CRow>
  )
}

export default Dashboard
