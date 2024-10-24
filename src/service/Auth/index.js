import { fetchAuthSession, getCurrentUser, signIn, signOut } from 'aws-amplify/auth'
import { API_URL } from '..'
import axios from 'axios'
import { toast } from 'react-toastify'

export const login = async (email, password) => {
  try {
    const res = await signIn({ username: email, password })

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
    console.log('error:45', error.message, error.code)
    if(error.message === 'An unknown error has occurred.')
      throw new Error('Please check your internet connection')
    
    if (error.message === 'Incorrect username or password.')
      throw new Error('Incorrect email or password.')
      
    throw new Error(error.message)
  }
}
