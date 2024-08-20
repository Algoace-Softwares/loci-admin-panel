import React from 'react'
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))

const routes = [
  { path: '/reports', name: 'Reports', element: Dashboard },
  { path: '*', name: '404 page', element: Page404 },
]

export default routes
