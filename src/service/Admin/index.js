import { API_URL } from '..'
import axios from 'axios'

/**
 * GET /admin/dashboard/metrics
 * Platform-wide aggregate stats
 */
export const getDashboardMetrics = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/dashboard/metrics`)
    return response
  } catch (error) {
    console.debug('error:service:admin:getDashboardMetrics', error)
    return null
  }
}

/**
 * GET /admin/dashboard/user-activity/:userId
 * Per-user all-time lifetime counts
 */
export const getUserActivityById = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/admin/dashboard/user-activity/${userId}`)
    return response
  } catch (error) {
    console.debug('error:service:admin:getUserActivityById', error)
    return null
  }
}

/**
 * GET /admin/dashboard/user-activity/:userId/range?range=week|month|year
 * Time-bucketed metrics for charts
 */
export const getUserActivityByRange = async (userId, range = 'week') => {
  try {
    const response = await axios.get(
      `${API_URL}/admin/dashboard/user-activity/${userId}/range?range=${range}`,
    )
    return response
  } catch (error) {
    console.debug('error:service:admin:getUserActivityByRange', error)
    return null
  }
}

/**
 * GET /admin/dashboard/metrics/chart
 * Dashboard charts data
 */
export const getDashboardCharts = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/dashboard/metrics/chart`)
    return response
  } catch (error) {
    console.debug('error:service:admin:getDashboardCharts', error)
    return null
  }
}
export const getAllUsers = async (page = 1, name = '', limit = 15) => {
  try {
    const response = await axios.get(
      `${API_URL}/user/all?page=${page}&limit=${limit}&name=${name}`,
    )
    return response
  } catch (error) {
    console.debug('error:service:admin:getAllUsers', error)
    return null
  }
}
