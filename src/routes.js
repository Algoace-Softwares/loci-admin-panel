import React from 'react'
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Reports = React.lazy(() => import('./views/reports/Reports'))
const CreatorDetail = React.lazy(() => import('./views/reports/CreatorDetail'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))

const routes = [
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/reports', name: 'Reports', element: Reports },
  { path: '/reports/:creatorId', name: 'Creator Details', element: CreatorDetail },
  { path: '*', name: '404 page', element: Page404 },
]

export default routes
