import axios from 'axios'
import { API_URL } from '..'

const buildQueryString = (params = {}) => {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    qs.append(key, String(value))
  })
  const out = qs.toString()
  return out ? `?${out}` : ''
}

/**
 * 0) Online users count (real-time-ish; backend decides).
 * GET /metrics/online-users
 */
export const getOnlineUsersCount = async (params) => {
  try {
    return await axios.get(`${API_URL}/metrics/online-users${buildQueryString(params)}`)
  } catch (error) {
    console.debug('error:service:metrics:getOnlineUsersCount', error)
    return null
  }
}

/**
 * 1) Users who posted (distinct users who created posts).
 * GET /metrics/users-with-posts
 */
export const getUsersWithPostsCount = async (params) => {
  try {
    return await axios.get(`${API_URL}/metrics/users-with-posts${buildQueryString(params)}`)
  } catch (error) {
    console.debug('error:service:metrics:getUsersWithPostsCount', error)
    return null
  }
}

/**
 * 2) Users who commented (distinct users who created comments).
 * GET /metrics/users-with-comments
 */
export const getUsersWithCommentsCount = async (params) => {
  try {
    return await axios.get(`${API_URL}/metrics/users-with-comments${buildQueryString(params)}`)
  } catch (error) {
    console.debug('error:service:metrics:getUsersWithCommentsCount', error)
    return null
  }
}

/**
 * 3) Overview metrics (aggregated).
 * GET /metrics/overview
 */
export const getOverviewMetrics = async (params) => {
  try {
    return await axios.get(`${API_URL}/metrics/overview${buildQueryString(params)}`)
  } catch (error) {
    console.debug('error:service:metrics:getOverviewMetrics', error)
    return null
  }
}

/**
 * 4/5) Charts + analysis use time series endpoints.
 * GET /metrics/<metric>/timeseries
 * Common params: from, to, interval (day|week|month), segment, etc.
 */
export const getUsersWithPostsTimeseries = async (params) => {
  try {
    return await axios.get(
      `${API_URL}/metrics/users-with-posts/timeseries${buildQueryString(params)}`,
    )
  } catch (error) {
    console.debug('error:service:metrics:getUsersWithPostsTimeseries', error)
    return null
  }
}

export const getUsersWithCommentsTimeseries = async (params) => {
  try {
    return await axios.get(
      `${API_URL}/metrics/users-with-comments/timeseries${buildQueryString(params)}`,
    )
  } catch (error) {
    console.debug('error:service:metrics:getUsersWithCommentsTimeseries', error)
    return null
  }
}

export const getAccountDeletionsTimeseries = async (params) => {
  try {
    return await axios.get(
      `${API_URL}/metrics/account-deletions/timeseries${buildQueryString(params)}`,
    )
  } catch (error) {
    console.debug('error:service:metrics:getAccountDeletionsTimeseries', error)
    return null
  }
}

export const getLogoutEventsTimeseries = async (params) => {
  try {
    return await axios.get(`${API_URL}/metrics/logout-events/timeseries${buildQueryString(params)}`)
  } catch (error) {
    console.debug('error:service:metrics:getLogoutEventsTimeseries', error)
    return null
  }
}

/**
 * 6) Filters are implemented by passing query params to all endpoints above.
 * Example params: { from, to, activityType, segment }
 */

/**
 * 7) Search user activity.
 * GET /activity/search?q=...&type=...&from=...&to=...&segment=...
 */
export const searchUserActivity = async (params) => {
  try {
    return await axios.get(`${API_URL}/activity/search${buildQueryString(params)}`)
  } catch (error) {
    console.debug('error:service:metrics:searchUserActivity', error)
    return null
  }
}

/**
 * 8) Total registered users.
 * GET /metrics/registered-users
 */
export const getTotalRegisteredUsers = async (params) => {
  try {
    return await axios.get(`${API_URL}/metrics/registered-users${buildQueryString(params)}`)
  } catch (error) {
    console.debug('error:service:metrics:getTotalRegisteredUsers', error)
    return null
  }
}

/**
 * 9) Account deletions count.
 * GET /metrics/account-deletions
 */
export const getAccountDeletionsCount = async (params) => {
  try {
    return await axios.get(`${API_URL}/metrics/account-deletions${buildQueryString(params)}`)
  } catch (error) {
    console.debug('error:service:metrics:getAccountDeletionsCount', error)
    return null
  }
}

/**
 * 10) Logout events count.
 * GET /metrics/logout-events
 */
export const getLogoutEventsCount = async (params) => {
  try {
    return await axios.get(`${API_URL}/metrics/logout-events${buildQueryString(params)}`)
  } catch (error) {
    console.debug('error:service:metrics:getLogoutEventsCount', error)
    return null
  }
}

/**
 * Creator detail analytics endpoints.
 * These are used by the report-creator detail page.
 */
export const getCreatorOverviewStats = async (creatorId, params) => {
  try {
    return await axios.get(
      `${API_URL}/metrics/creators/${creatorId}/overview${buildQueryString(params)}`,
    )
  } catch (error) {
    console.debug('error:service:metrics:getCreatorOverviewStats', error)
    return null
  }
}

export const getCreatorTimeseriesStats = async (creatorId, params) => {
  try {
    return await axios.get(
      `${API_URL}/metrics/creators/${creatorId}/timeseries${buildQueryString(params)}`,
    )
  } catch (error) {
    console.debug('error:service:metrics:getCreatorTimeseriesStats', error)
    return null
  }
}
