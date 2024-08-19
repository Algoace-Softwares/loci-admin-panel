import { API_URL } from '..'
import axios from 'axios'
import { toast } from 'react-toastify'

export const getAllReports = async (currentPage) => {
  try {
    const response = await axios.get(`${API_URL}/report/all?page=${currentPage}&limit=50`)
    console.log('response', response)
    return response
  } catch (error) {
    console.log('error:service:reports1:', error)
    toast.error(error)
  }
}

export const getReportsById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/reports/${id}`)
    return response
  } catch (error) {
    console.log('error:service:reports:', error)
    toast.error(error)
  }
}

export const updateReportById = async (id, adminFeedback, action) => {
  try {
    const response = await axios.patch(`${API_URL}/report/${id}`, {
      ticketStatus: 'RESOLVED',
      adminFeedback,
      action,
    })
    return response
  } catch (error) {
    console.log('error:service:reports:', error)
    toast.error(error)
  }
}
