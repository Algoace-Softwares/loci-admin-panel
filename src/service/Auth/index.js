import { fetchAuthSession, getCurrentUser, signIn, signOut } from 'aws-amplify/auth'
import { API_URL } from '..'
import axios from 'axios'
import { toast } from 'react-toastify'

export const login = async (email, password) => {
  try {
    // Clear any stale session before signing in
    try { await signOut() } catch (_) {}
    const res = await signIn({ username: email, password })
    console.debug('res', res)
    const currentUser = await getCurrentUser()

    const attribute = await fetchAuthSession()
    const token = `Bearer ${attribute?.tokens?.accessToken}`

    const cognitoId = currentUser.userId

    if (attribute?.tokens?.accessToken?.payload?.['cognito:groups']?.[0] !== 'Admin') {
      toast.error('Not an Admin')
      await signOut()
      return
    }

    // BACKEND API
    console.debug('Making API request to get user information')
    const loginAPI = await axios.get(`${API_URL}/user?cognitoId=${cognitoId}`, {
      headers: { Authorization: token },
    })
    console.debug('API response:', loginAPI)

    console.debug('Final log information:', {
      signInResponse: res,
      currentUser,
      authSession: attribute,
      apiResponse: loginAPI,
      isAdmin: attribute?.tokens?.accessToken?.payload['cognito:groups'],
    })
    return { data: loginAPI.data, credentials: attribute }
  } catch (error) {
    console.debug('error:45', error.message, error.code)
    if (error.message === 'An unknown error has occurred.')
      throw new Error('Please check your internet connection')

    if (error.message === 'Incorrect username or password.')
      throw new Error('Incorrect email or password.')

    if (error.message === 'User does not exist.') throw new Error('Invalid email or password.')

    throw new Error(error.message)
  }
}
