import { API_URL } from '..'
import axios from 'axios'
import { toast } from 'react-toastify'

export const getAllReports = async () => {
  try {
    const response = await axios.get(`${API_URL}/report/all`)
    console.log('response', response)
    return response
  } catch (error) {
    console.log('error:service:reports1:', error)
    toast.error('Please try again')
  }
}

export const getReportsById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/reports/${id}`)
    return response
  } catch (error) {
    console.log('error:service:reports:', error)
    toast.error('Please try again')
  }
}
