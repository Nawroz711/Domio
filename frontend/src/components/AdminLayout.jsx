import { useState, useEffect } from 'react'
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Building2,
  Home,
  Building,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  BellIcon,
  PlusCircle
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import axiosClient from '../lib/axiosClient'

const menuItems = (userRole) => [
  {
    title: 'Dashboard',
    path: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Requests',
    path: '/admin/requests',
    icon: BellIcon,
  },
  {
    title: 'Properties',
    icon: Building2,
    children: [
      ...(userRole === 'agent' ? [{
        title: 'New Property',
        path: '/admin/properties/create',
        icon: PlusCircle,
        isNewProperty: true,
      }] : []),
      {
        title: 'Apartment',
        path: '/admin/properties/apartments',
        icon: Building,
      },
      {
        title: 'House',
        path: '/admin/properties/homes',
        icon: Home,
      },
    ],
  },
  {
    title: 'User Accounts',
    path: '/admin/users',
    icon: Users,
  },
  {
    title: 'Settings',
    path: '/admin/settings',
    icon: Settings,
  },
]

export default function AdminLayout() {
  const [expandedMenus, setExpandedMenus] = useState(['Properties'])
  const [profileLoaded, setProfileLoaded] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)

  useEffect(() => {
    if (user && !profileLoaded) {
      setProfileLoaded(true)
      axiosClient.get('/users/profile')
        .then(res => {
          if (res?.data?.data) {
            setUser(res.data.data)
          }
        })
        .catch(console.error)
    }
  }, [user, profileLoaded, setUser])

  const getAvatarUrl = (avatar) => {
    if (!avatar) return null
    if (avatar.startsWith('http')) return avatar
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
    return `${baseURL}${avatar}`
  }

  const toggleMenu = (title) => {
    setExpandedMenus((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    )
  }

  const handleLogout = () => {
    logout()
    navigate('/signin')
  }

  const isActive = (path) => location.pathname === path

  const isParentActive = (item) => {
    if (item.children) {
      return item.children.some((child) => location.pathname === child.path)
    }
    return false
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="h-16 flex items-center px-4 border-b border-gray-200">
          <img src="/logo.webp" alt="Domio" className="w-24 rounded-lg" />
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems(user?.role).map((item) => (
              <li key={item.title}>
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleMenu(item.title)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${isParentActive(item)
                          ? 'bg-primary/10 text-primary'
                          : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" strokeWidth={1.25} />
                        <span className="text-sm font-medium">{item.title}</span>
                      </div>

                      {expandedMenus.includes(item.title) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>

                    {expandedMenus.includes(item.title) && (
                      <ul className="ml-4 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <li key={child.title}>
                            <Link
                              to={child.path}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${isActive(child.path)
                                  ? 'bg-primary text-white'
                                  : 'text-gray-600 hover:bg-gray-100'
                                } ${child.isNewProperty ? 'border-2 border-dashed border-primary/50' : ''}`}
                            >
                              {child.isNewProperty ? (
                                <div className="relative">
                                  <child.icon className="w-4 h-4" />
                                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                                  </span>
                                </div>
                              ) : (
                                <child.icon className="w-4 h-4" />
                              )}
                              {child.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive(item.path)
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <item.icon className="w-5 h-5" strokeWidth={1.25} />
                    <span className="text-sm font-medium">{item.title}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <Link to={'/profile'}>
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium overflow-hidden">
                  {user?.avatar ? (
                    <img src={getAvatarUrl(user.avatar)} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    user?.name?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-white">
        <Outlet />
      </main>
    </div>
  )
}