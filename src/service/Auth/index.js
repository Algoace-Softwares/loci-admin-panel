import { fetchAuthSession, getCurrentUser, signIn, signOut } from 'aws-amplify/auth'
import { API_URL } from '..'
import axios from 'axios'
import { toast } from 'react-toastify'

export const login = async (email, password) => {
  try {
    console.log('Attempting to sign in with email:', email)
    const res = await signIn({ username: email, password })
    console.log('Sign-in response:', res)

    console.log('Fetching current user')
    const currentUser = await getCurrentUser()
    console.log('Current user:', currentUser)

    console.log('Fetching authentication session')
    const attribute = await fetchAuthSession()
    const token = `Bearer ${attribute?.tokens?.accessToken}`
    console.log('Authentication session:', token, attribute)

    const cognitoId = currentUser.userId
    console.log('Cognito ID:', cognitoId)

    if (attribute?.tokens?.accessToken?.payload?.['cognito:groups']?.[0] !== 'Admin') {
      console.log('User is not an Admin')
      toast.error('Not an Admin')
      console.log('Signing out user')
      await signOut()
      console.log('User signed out')
      return
    }

    // BACKEND API
    console.log('Making API request to get user information')
    const loginAPI = await axios.get(`${API_URL}/user?cognitoId=${cognitoId}`, {
      headers: { Authorization: token },
    })
    console.log('API response:', loginAPI)

    console.log('Final log information:', {
      signInResponse: res,
      currentUser,
      authSession: attribute,
      apiResponse: loginAPI,
      isAdmin: attribute?.tokens?.accessToken?.payload['cognito:groups'],
    })
    return { data: loginAPI.data, credentials: attribute }
  } catch (error) {
    console.log('error:45', error)
  }
}
