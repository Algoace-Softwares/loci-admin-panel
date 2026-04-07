import React, { useEffect, useState } from 'react'
import MainRoutes from '../layout/MainRoutes'
import { CButton } from '@coreui/react'

export const NoInternetWrapper = () => {
  // state variable holds the state of the internet connection
  const [isOnline, setOnline] = useState(true)

  // On initization set the isOnline state.
  useEffect(() => {
    setOnline(navigator.onLine)

    // event listeners to update the state
    window.addEventListener('online', () => {
      setOnline(true)
    })

    window.addEventListener('offline', () => {
      setOnline(false)
    })

    return () => {
      window.removeEventListener('online', () => {
        setOnline(true)
      })
      window.removeEventListener('offline', () => {
        setOnline(false)
      })
    }
  }, [])

  //   if user is online, return the child component else return a custom component
  if (isOnline) {
    return <MainRoutes />
  } else {
    return (
      <div
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem', // Adjust as needed
        }}
      >
        <h1
          style={{
            fontSize: '1.875rem', // Corresponds to text-3xl
            color: 'var(--primary-main)', // Replace with your primary color
          }}
        >
          No internet connection!
        </h1>
        <p
          style={{
            color: 'var(--secondary)', // Replace with your secondary color
          }}
        >
          Please check your network connection
        </p>
        <CButton
          size="sm"
          variant="outline"
          style={{
            width: '10rem', // Corresponds to w-40
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem', // Adjust as needed
            border: '1px solid', // Adjust border styling as needed
            padding: '0.5rem', // Adjust padding as needed
            cursor: 'pointer',
          }}
          onClick={() => window.location.reload()}
        >
          Try Again
        </CButton>
      </div>
    )
  }
}
