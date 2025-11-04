import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { departmentInfo, departments } from '../utils/departments'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentDeptIndex, setCurrentDeptIndex] = useState(0)
  const [currentTextIndex, setCurrentTextIndex] = useState(-1) // Start with -1 to show CONNECT for 10s first
  const [currentTime, setCurrentTime] = useState(new Date())
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuth, username, logout } = useAuth()

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Cycle through departments every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDeptIndex((prev) => (prev + 1) % departments.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  // Show CONNECT for 10s first, then cycle through: College Name -> Welcome Message -> Date -> Time
  useEffect(() => {
    // CONNECT (index -1) stays for 10 seconds, then start rotating other items
    const duration = currentTextIndex === -1 ? 10000 : 5000

    const timeout = setTimeout(() => {
      setCurrentTextIndex((prev) => {
        if (prev === -1) return 0 // After CONNECT, start with College Name
        return (prev + 1) % 4 // Cycle through 4 items (0-3)
      })
    }, duration)

    return () => clearTimeout(timeout)
  }, [currentTextIndex])

  const currentDept = departments[currentDeptIndex]
  const deptInfo = departmentInfo[currentDept]

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const getHeaderText = () => {
    switch (currentTextIndex) {
      case -1:
        return 'CONNECT'
      case 0:
        return 'Sanjay Memorial Polytechnic, Sagar'
      case 1:
        return 'Welcome To SMP'
      case 2:
        return formatDate()
      case 3:
        return formatTime()
      default:
        return 'CONNECT'
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
    setIsMenuOpen(false)
  }

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault()
    navigate('/', { replace: true })
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
      <style>{`
        @keyframes flipLetter {
          0% {
            transform: rotateX(0deg);
            opacity: 1;
          }
          50% {
            transform: rotateX(90deg);
            opacity: 0;
          }
          100% {
            transform: rotateX(0deg);
            opacity: 1;
          }
        }

        .flip-letter-1 {
          animation: flipLetter 1.2s cubic-bezier(0.4, 0, 0.2, 1);
          animation-delay: 0s;
        }

        .flip-letter-2 {
          animation: flipLetter 1.2s cubic-bezier(0.4, 0, 0.2, 1);
          animation-delay: 0.4s;
        }

        .flip-letter-3 {
          animation: flipLetter 1.2s cubic-bezier(0.4, 0, 0.2, 1);
          animation-delay: 0.8s;
        }

        .logo-letter {
          display: inline-block;
          transform-style: preserve-3d;
        }

        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          10% {
            opacity: 1;
            transform: translateY(0);
          }
          90% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(10px);
          }
        }

        .header-text-animate {
          animation: fadeInOut 5s ease-in-out;
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <a href="/" onClick={handleDashboardClick} className="flex items-center space-x-2 sm:space-x-3 cursor-pointer">
            <div className="flex-shrink-0">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 ${deptInfo.bgClass} rounded-lg flex items-center justify-center transition-colors duration-700`}>
                <span className={`${deptInfo.textClass} font-extrabold text-lg sm:text-xl transition-colors duration-700 flex`} key={currentDeptIndex}>
                  <span className="logo-letter flip-letter-1">S</span>
                  <span className="logo-letter flip-letter-2">M</span>
                  <span className="logo-letter flip-letter-3">P</span>
                </span>
              </div>
            </div>
            <div className="hidden sm:block">
              <h1
                className={`text-3xl font-extrabold ${deptInfo.textClass} transition-all duration-700 header-text-animate`}
                key={currentTextIndex}
              >
                {getHeaderText()}
              </h1>
            </div>
            <div className="sm:hidden">
              <h1
                className={`text-xl font-extrabold ${deptInfo.textClass} leading-tight transition-all duration-700 header-text-animate`}
                key={currentTextIndex}
              >
                {getHeaderText()}
              </h1>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              if (link.protected && !isAuth) return null

              if (link.to === '/') {
                return (
                  <a
                    key={link.to}
                    href="/"
                    onClick={handleDashboardClick}
                    className={`px-4 py-2 rounded-lg font-medium transition cursor-pointer ${
                      isActive(link.to)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {link.label}
                  </a>
                )
              }

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

                if (link.to === '/') {
                  return (
                    <a
                      key={link.to}
                      href="/"
                      onClick={handleDashboardClick}
                      className={`px-4 py-3 rounded-lg font-medium transition cursor-pointer ${
                        isActive(link.to)
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {link.label}
                    </a>
                  )
                }

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
