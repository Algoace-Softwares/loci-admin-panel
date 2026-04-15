import axios from 'axios'

export const API_URL = 'https://myf4pyapm4.execute-api.eu-west-1.amazonaws.com/dev/api/v1'

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
})
