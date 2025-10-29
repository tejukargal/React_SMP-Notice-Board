import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { departmentInfo, departments } from '../utils/departments'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentDeptIndex, setCurrentDeptIndex] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuth, username, logout } = useAuth()

  // Load Impact font for header
  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.cdnfonts.com/css/impact'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [])

  // Cycle through departments every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDeptIndex((prev) => (prev + 1) % departments.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const currentDept = departments[currentDeptIndex]
  const deptInfo = departmentInfo[currentDept]

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMenuOpen(false)
  }

  const navLinks = [
    { to: '/', label: 'Dashboard' },
    { to: '/circulars', label: 'All Circulars' },
    { to: '/admin', label: 'Admin Panel', protected: true },
  ]

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 ${deptInfo.bgClass} rounded-lg flex items-center justify-center transition-all duration-700`}>
                <span className={`${deptInfo.textClass} font-extrabold text-sm sm:text-base transition-all duration-700`}
                  style={{ fontFamily: "'Impact', 'Arial Black', 'Helvetica Neue', Arial, sans-serif" }}
                >
                  SMP
                </span>
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-xl font-extrabold ${deptInfo.textClass} transition-all duration-700`}
                style={{ fontFamily: "'Impact', 'Arial Black', 'Helvetica Neue', Arial, sans-serif" }}
              >
                Sanjay Memorial Polytechnic, Sagar
              </h1>
              <p className={`text-xs font-bold ${deptInfo.textClass} opacity-80 transition-all duration-700`}
                style={{ fontFamily: "'Impact', 'Arial Black', 'Helvetica Neue', Arial, sans-serif" }}
              >
                Notice Board
              </p>
            </div>
            <div className="sm:hidden">
              <div>
                <h1 className={`text-sm font-extrabold ${deptInfo.textClass} leading-tight transition-all duration-700`}
                  style={{ fontFamily: "'Impact', 'Arial Black', 'Helvetica Neue', Arial, sans-serif" }}
                >
                  Sanjay Memorial Polytechnic, Sagar
                </h1>
                <p className={`text-xs font-bold ${deptInfo.textClass} opacity-80 transition-all duration-700`}
                  style={{ fontFamily: "'Impact', 'Arial Black', 'Helvetica Neue', Arial, sans-serif" }}
                >
                  Notice Board
                </p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              if (link.protected && !isAuth) return null

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    isActive(link.to)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}

            {isAuth ? (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-300">
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Admin Login
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                if (link.protected && !isAuth) return null

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg font-medium transition ${
                      isActive(link.to)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}

              {isAuth ? (
                <>
                  <div className="px-4 py-3 bg-gray-100 rounded-lg flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">{username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition text-left flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition text-center"
                >
                  Admin Login
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
