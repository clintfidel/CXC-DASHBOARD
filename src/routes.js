import { Navigate, useRoutes } from 'react-router-dom';

// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';

import DashboardApp from './pages/DashboardApp';

import NotFound from './pages/Page404';

// ----------------------------------------------------------------------
const admin = 'ADMIN';

export default function Router() {
  return useRoutes([
    { path: '/', element: <Login /> },
    {
      path: '/admin',
      element: <DashboardLayout />,
      children: [
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
