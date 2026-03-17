import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import SignIn from '../pages/Auth/SignIn'
import NotFound from '../pages/Common/NotFound'
import { useAuthStore } from '../store/authStore'
import AdminLayout from '../components/AdminLayout'
import WebsiteLayout from '../components/website/WebsiteLayout'
import HomePage from '../pages/website/Home'
import PropertiesPage from '../pages/website/Properties'
import AboutPage from '../pages/website/About'
import ContactPage from '../pages/website/Contact'

function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  // if (!isAuthenticated) {
  //   return <Navigate to="/signin" replace />
  // }

  return <Outlet />
}

function PublicOnlyRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />
  }

  return <Outlet />
}

// Lazy load admin pages
const DashboardPage = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
    <p className="text-gray-600 mt-2">Welcome to the admin dashboard</p>
  </div>
)

const AgentsPage = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-gray-800">Agents</h1>
    <p className="text-gray-600 mt-2">Manage agents here</p>
  </div>
)

const ApartmentsPage = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-gray-800">Apartments</h1>
    <p className="text-gray-600 mt-2">Manage apartments here</p>
  </div>
)

const HomesPage = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-gray-800">Homes</h1>
    <p className="text-gray-600 mt-2">Manage homes here</p>
  </div>
)

const ShopsPage = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-gray-800">Shops</h1>
    <p className="text-gray-600 mt-2">Manage shops here</p>
  </div>
)

const UsersPage = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
    <p className="text-gray-600 mt-2">Manage users here</p>
  </div>
)

const SettingsPage = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
    <p className="text-gray-600 mt-2">Manage settings here</p>
  </div>
)

export const router = createBrowserRouter([
  // Website Routes (Public)
  {
    element: <WebsiteLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/properties',
        element: <PropertiesPage />,
      },
      {
        path: '/properties/apartments',
        element: <PropertiesPage />,
      },
      {
        path: '/properties/homes',
        element: <PropertiesPage />,
      },
      {
        path: '/properties/shops',
        element: <PropertiesPage />,
      },
      {
        path: '/about',
        element: <AboutPage />,
      },
      {
        path: '/contact',
        element: <ContactPage />,
      },
    ],
  },

  // Auth Routes (Public - only for non-authenticated users)
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        path: '/signin',
        element: <SignIn />,
      },
    ],
  },

  // Admin Routes (Protected - requires authentication)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: '/admin/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/admin/agents',
            element: <AgentsPage />,
          },
          {
            path: '/admin/properties',
            element: <Navigate to="/admin/properties/apartments" replace />,
          },
          {
            path: '/admin/properties/apartments',
            element: <ApartmentsPage />,
          },
          {
            path: '/admin/properties/homes',
            element: <HomesPage />,
          },
          {
            path: '/admin/properties/shops',
            element: <ShopsPage />,
          },
          {
            path: '/admin/users',
            element: <UsersPage />,
          },
          {
            path: '/admin/settings',
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },

  // 404 Route
  {
    path: '*',
    element: <NotFound />,
  },
])
