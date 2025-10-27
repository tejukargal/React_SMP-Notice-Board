import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Calendar, FileText, ArrowRight } from 'lucide-react'
import { circularsAPI } from '../api/client'
import { Circular, Department } from '../types'
import { departmentInfo } from '../utils/departments'
import CircularTicker from '../components/CircularTicker'
import { renderHtmlContent } from '../utils/htmlContent'
import CSVTicker from '../components/CSVTicker'
import CircularPreviewStack from '../components/CircularPreviewStack'

const Dashboard = () => {
  const [circulars, setCirculars] = useState<Circular[]>([])
  const [featuredCircular, setFeaturedCircular] = useState<Circular | null>(null)
  const [availableCategories, setAvailableCategories] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentInfoIndex, setCurrentInfoIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [currentDateTime, setCurrentDateTime] = useState(new Date())
  const navigate = useNavigate()

  useEffect(() => {
    loadCirculars()
  }, [])

  // Handle back button press to exit app
  useEffect(() => {
    const handleBackButton = (e: PopStateEvent) => {
      e.preventDefault()

      // Check if we're on Dashboard (root path)
      if (window.location.pathname === '/') {
        const confirmExit = window.confirm('Do you want to exit the app?')
        if (confirmExit) {
          // Try to close the window/tab
          window.close()

          // If window.close() doesn't work (most modern browsers block it),
          // navigate to about:blank or show a message
          if (!window.closed) {
            window.location.href = 'about:blank'
          }
        } else {
          // Push a new state to prevent going back
          window.history.pushState(null, '', window.location.pathname)
        }
      }
    }

    // Push initial state
    window.history.pushState(null, '', window.location.pathname)

    // Listen for back button
    window.addEventListener('popstate', handleBackButton)

    return () => {
      window.removeEventListener('popstate', handleBackButton)
    }
  }, [])

  // Generate dynamic information array
  const generateInfo = (): string[] => {
    const info: string[] = []

    // Current date and time
    const dateTimeStr = currentDateTime.toLocaleString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    info.push(dateTimeStr)

    // Total circulars count
    info.push(`Total ${circulars.length} circular${circulars.length !== 1 ? 's' : ''} available`)

    // Department counts
    const deptCounts = circulars.reduce((acc, c) => {
      acc[c.department] = (acc[c.department] || 0) + 1
      return acc
    }, {} as Record<Department, number>)

    // Add department-specific counts (only if > 0)
    Object.entries(deptCounts)
      .filter(([dept]) => dept !== 'All')
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .forEach(([dept, count]) => {
        info.push(`${count} ${dept} circular${count !== 1 ? 's' : ''} posted`)
      })

    // Recent circular info
    if (circulars.length > 0) {
      const latest = circulars[0]
      const daysAgo = Math.floor((Date.now() - new Date(latest.date).getTime()) / (1000 * 60 * 60 * 24))
      if (daysAgo === 0) {
        info.push(`Latest circular posted today`)
      } else if (daysAgo === 1) {
        info.push(`Latest circular posted yesterday`)
      } else if (daysAgo < 7) {
        info.push(`Latest circular posted ${daysAgo} days ago`)
      }
    }

    // Featured circular
    const featuredCount = circulars.filter(c => c.is_featured).length
    if (featuredCount > 0) {
      info.push(`Featured circular available`)
    }

    // Attachments count
    const totalAttachments = circulars.reduce((sum, c) => sum + (c.attachments?.length || 0), 0)
    if (totalAttachments > 0) {
      info.push(`${totalAttachments} attachment${totalAttachments !== 1 ? 's' : ''} shared`)
    }

    // Features
    info.push('Real-time updates with instant notifications')
    info.push('Department-wise categorization for easy access')
    info.push('Download attachments directly from circulars')
    info.push('Mobile-friendly responsive design')
    info.push('Search and filter circulars by category')

    // This week's count
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const thisWeekCount = circulars.filter(c => new Date(c.date) >= weekAgo).length
    if (thisWeekCount > 0) {
      info.push(`${thisWeekCount} circular${thisWeekCount !== 1 ? 's' : ''} posted this week`)
    }

    return info
  }

  const infoItems = generateInfo()

  // Rotate info every 5 seconds
  useEffect(() => {
    if (infoItems.length <= 1) return

    const interval = setInterval(() => {
      setIsTransitioning(true)

      setTimeout(() => {
        setCurrentInfoIndex((prev) => (prev + 1) % infoItems.length)
        setIsTransitioning(false)
      }, 300)
    }, 5000)

    return () => clearInterval(interval)
  }, [infoItems.length])

  // Update date/time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const loadCirculars = async () => {
    try {
      const data = await circularsAPI.getAll()
      setCirculars(data)

      // Find featured circular or use latest
      const featured = data.find(c => c.is_featured) || data[0]
      setFeaturedCircular(featured)

      // Get unique categories that have circulars
      const uniqueCategories = Array.from(new Set(data.map(c => c.department)))
      // Filter out 'All' and sort to put it first if it exists
      const categoriesWithoutAll = uniqueCategories.filter(cat => cat !== 'All')
      setAvailableCategories(categoriesWithoutAll as Department[])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="loader mb-4 mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
          <style>{`
            .loader {
              width: 50px;
              aspect-ratio: 1;
              display: grid;
              color: #2563eb;
              background: radial-gradient(farthest-side, currentColor calc(100% - 6px),#0000 calc(100% - 5px) 0);
              -webkit-mask: radial-gradient(farthest-side,#0000 calc(100% - 13px),#000 calc(100% - 12px));
              border-radius: 50%;
              animation: l19 2s infinite linear;
            }
            .loader::before,
            .loader::after {
              content: "";
              grid-area: 1/1;
              background:
                linear-gradient(currentColor 0 0) center,
                linear-gradient(currentColor 0 0) center;
              background-size: 100% 10px,10px 100%;
              background-repeat: no-repeat;
            }
            .loader::after {
              transform: rotate(45deg);
            }
            @keyframes l19 {
              100%{transform: rotate(1turn)}
            }
          `}</style>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Ticker */}
      <CircularTicker circulars={circulars} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <style>{`
          @keyframes popup {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-popup {
            animation: popup 0.6s ease-out forwards;
            opacity: 0;
          }

          @keyframes slideIn {
            0% {
              opacity: 0;
              transform: translateY(-10px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideOut {
            0% {
              opacity: 1;
              transform: translateY(0);
            }
            100% {
              opacity: 0;
              transform: translateY(10px);
            }
          }

          .info-text-enter {
            animation: slideIn 0.6s ease-out forwards;
          }

          .info-text-exit {
            animation: slideOut 0.6s ease-out forwards;
          }
        `}</style>

        {/* Compact Department Filters - Only show categories with circulars */}
        {availableCategories.length > 0 && (
          <div className="mb-8">
            <div className="mb-4 overflow-hidden">
              <h2
                className={`text-base sm:text-xl md:text-2xl font-bold text-gray-900 transition-all duration-600 whitespace-nowrap overflow-x-auto scrollbar-hide ${
                  isTransitioning ? 'info-text-exit' : 'info-text-enter'
                }`}
                key={currentInfoIndex}
              >
                {infoItems[currentInfoIndex] || 'Browse by Category'}
              </h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="flex items-center overflow-x-auto scrollbar-hide">
                {availableCategories.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => navigate(`/circulars?department=${dept}`)}
                    className="flex-shrink-0 px-6 py-4 font-medium transition border-b-2 border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-blue-300"
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Featured Circular */}
        {featuredCircular && (
          <div className="mb-8 animate-popup" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Featured Circular</h2>
              <Link
                to="/circulars"
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 text-sm"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div
              className={`${departmentInfo[featuredCircular.department].bgClass} border-l-4 ${departmentInfo[featuredCircular.department].borderClass} rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow`}
            >
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span
                    className={`px-4 py-1.5 ${departmentInfo[featuredCircular.department].bgClass} ${departmentInfo[featuredCircular.department].textClass} rounded-full text-sm font-semibold border-2 ${departmentInfo[featuredCircular.department].borderClass}`}
                  >
                    {featuredCircular.department}
                  </span>
                  <div className="flex items-center gap-2 text-gray-600 text-base">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(featuredCircular.date)}</span>
                  </div>
                  {featuredCircular.attachments && featuredCircular.attachments.filter(file => !file.name.toLowerCase().trim().endsWith('.csv')).length > 0 && (
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                      <FileText className="w-4 h-4" />
                      <span>{featuredCircular.attachments.filter(file => !file.name.toLowerCase().trim().endsWith('.csv')).length} attachment(s)</span>
                    </div>
                  )}
                </div>

                <h3 className="text-[26px] sm:text-[34px] font-bold text-gray-900 mb-3">
                  {featuredCircular.title}
                </h3>

                <p
                  className={`text-[20px] ${departmentInfo[featuredCircular.department].textClass} font-medium mb-4`}
                >
                  {featuredCircular.subject}
                </p>

                <div
                  className="prose prose-sm sm:prose max-w-none text-gray-700 leading-relaxed [&>*]:text-[16px]"
                  dangerouslySetInnerHTML={renderHtmlContent(featuredCircular.body)}
                />

                {/* CSV Ticker Preview */}
                {featuredCircular.attachments && featuredCircular.attachments.some(file => file.name.toLowerCase().endsWith('.csv')) && (
                  <div className="mt-6">
                    {featuredCircular.attachments
                      .filter(file => file.name.toLowerCase().endsWith('.csv'))
                      .map((file, index) => (
                        <CSVTicker key={index} csvBase64={file.base64} fileName={file.name} />
                      ))}
                  </div>
                )}

                {/* Attachments - Exclude CSV files as they are shown in ticker */}
                {featuredCircular.attachments && featuredCircular.attachments.filter(file => !file.name.toLowerCase().trim().endsWith('.csv')).length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Attachments:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {featuredCircular.attachments
                        .filter(file => !file.name.toLowerCase().trim().endsWith('.csv'))
                        .map((file, index) => (
                          <a
                            key={index}
                            href={file.base64}
                            download={file.name}
                            className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition group"
                          >
                            <FileText className="w-8 h-8 text-blue-600 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate group-hover:text-blue-600">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(file.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          </a>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Compact Preview Stack */}
        {circulars.length > 1 && (
          <div className="mb-8 animate-popup" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Preview</h2>
            <CircularPreviewStack circulars={circulars} />
          </div>
        )}

        {/* Recent Circulars Preview - Only 2 */}
        {circulars.length > 1 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Circulars</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {circulars.filter(c => c.id !== featuredCircular?.id).slice(0, 2).map((circular, index) => (
                <Link
                  key={circular.id}
                  to={`/circulars`}
                  className={`${departmentInfo[circular.department].bgClass} border-l-4 ${departmentInfo[circular.department].borderClass} rounded-lg p-4 hover:shadow-lg transition-shadow animate-popup`}
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-3 py-1 ${departmentInfo[circular.department].textClass} rounded-full text-xs font-semibold border ${departmentInfo[circular.department].borderClass}`}
                    >
                      {circular.department}
                    </span>
                    <span className="text-xs text-gray-600">
                      {formatDate(circular.date)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                    {circular.title}
                  </h3>
                  <p
                    className={`text-sm ${departmentInfo[circular.department].textClass} font-medium line-clamp-1`}
                  >
                    {circular.subject}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && circulars.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No circulars available yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
