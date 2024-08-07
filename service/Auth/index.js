import { fetchAuthSession, getCurrentUser, signIn, signOut } from 'aws-amplify/auth'
import { API_URL } from '..'
import axios from 'axios'
import { toast } from 'react-toastify'

export const login = async (email, password) => {
  const res = await signIn({ username: email, password })

  const currentUser = await getCurrentUser()
  const attribute = await fetchAuthSession()

  const cognitoId = currentUser.userId
  if (attribute?.tokens?.accessToken?.payload?.['cognito:groups']?.[0] !== 'Admin') {
    console.log('not admin')
    toast.error('Not an Admin')
    await signOut()
    return
    // show error
  }
  // BACKEND API

  const loginAPI = await axios.get(`${API_URL}/user?cognitoId=${cognitoId}`)

  console.log(
    'Current user: ',
    res,
    currentUser,
    attribute,
    loginAPI,
    'isAdmin',
    attribute?.tokens?.accessToken?.payload['cognito:groups'],
  )

  return { data: loginAPI.data, credentials: attribute }
}
