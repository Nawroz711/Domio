import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import SignIn from '../pages/Auth/SignIn'
import SignUp from '../pages/Auth/SignUp'
import NotFound from '../pages/Common/NotFound'
import { useAuthStore } from '../store/authStore'
import Profile from '../pages/Auth/Profile'
import MapPage from '../pages/Map/MapPage'

function ProtectedRoute() {

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

}

function PublicOnlyRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/wallet" replace />
  }

  return <Outlet />
}

function RootRedirect() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  return <Navigate to={isAuthenticated ? '/map' : '/signin'} replace />
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MapPage />,
  },
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        path: '/signin',
        element: <SignIn />,
      },
      {
        path: '/signup',
        element: <SignUp />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/map',
        element: <MapPage />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },  
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])
