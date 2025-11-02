import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Calendar, FileText, ArrowRight } from 'lucide-react'
import { Circular, Department } from '../types'
import { departmentInfo } from '../utils/departments'
import { renderHtmlContent } from '../utils/htmlContent'
import CSVTicker from '../components/CSVTicker'
import CircularPreviewStack from '../components/CircularPreviewStack'
import RotatingInfoCard from '../components/RotatingInfoCard'
import CircularModal from '../components/CircularModal'
import { useCirculars } from '../context/CircularsContext'

const Dashboard = () => {
  const { circulars, loading, error, fetchCirculars } = useCirculars()
  const [featuredCircular, setFeaturedCircular] = useState<Circular | null>(null)
  const [availableCategories, setAvailableCategories] = useState<Department[]>([])
  const [featuredAnimationKey, setFeaturedAnimationKey] = useState(0)
  const [activeDepartment, setActiveDepartment] = useState<Department | null>(null)
  const [selectedCircular, setSelectedCircular] = useState<Circular | null>(null)
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const activeTabRef = useRef<HTMLButtonElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCirculars()
  }, [])

  // Clear navigation history and handle back button to exit app
  useEffect(() => {
    const handlePopState = () => {
      // Exit app directly without confirmation
      window.close()

      // Fallback if window.close() doesn't work
      setTimeout(() => {
        if (!window.closed) {
          window.location.href = 'about:blank'
        }
      }, 100)
    }

    // Listen for back button
    window.addEventListener('popstate', handlePopState)

    // Push a state entry so back button triggers popstate
    window.history.pushState(null, '', '/')

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  // Update featured circular and categories when circulars change
  useEffect(() => {
    if (circulars.length > 0) {
      // Find featured circular or use latest
      const featured = circulars.find(c => c.is_featured) || circulars[0]
      setFeaturedCircular(featured)

      // Get unique categories that have circulars
      const uniqueCategories = Array.from(new Set(circulars.map(c => c.department)))
      // Filter out 'All' and sort to put it first if it exists
      const categoriesWithoutAll = uniqueCategories.filter(cat => cat !== 'All')
      setAvailableCategories(categoriesWithoutAll as Department[])
    }
  }, [circulars])

  // Re-trigger featured circular animations every 10 seconds
  useEffect(() => {
    if (!featuredCircular) return

    const interval = setInterval(() => {
      setFeaturedAnimationKey(prev => prev + 1)
    }, 10000)

    return () => clearInterval(interval)
  }, [featuredCircular])

  // Auto-scroll active tab into view
  useEffect(() => {
    if (activeDepartment && activeTabRef.current && tabsContainerRef.current) {
      // Small delay to ensure DOM has updated
      setTimeout(() => {
        const tabElement = activeTabRef.current
        const containerElement = tabsContainerRef.current

        if (tabElement && containerElement) {
          // Calculate scroll position to center the active tab
          const tabLeft = tabElement.offsetLeft
          const tabWidth = tabElement.offsetWidth
          const containerWidth = containerElement.offsetWidth
          const scrollPosition = tabLeft - (containerWidth / 2) + (tabWidth / 2)

          // Smooth scroll to the active tab
          containerElement.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
          })
        }
      }, 100)
    }
  }, [activeDepartment])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-50 z-50 flex items-center justify-center transition-opacity duration-300">
        <div className="text-center">
          <div className="loader mb-4 mx-auto"></div>
          <p className="text-gray-600 text-lg font-medium">Loading...</p>
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
    <div className="min-h-screen animate-fadeIn">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-4 animate-popup" style={{ animationDelay: '0s' }}>
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Josefin Sans', 'Noto Sans Kannada', sans-serif" }}>Dashboard</h1>
          <p className="text-gray-600">Welcome to SMP Notice Board</p>
        </div>

        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          .animate-fadeIn {
            animation: fadeIn 0.3s ease-in forwards;
          }

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

          /* Featured circular modern font - Josefin Sans for English, Noto Sans Kannada for Kannada */
          .featured-circular-modern {
            font-family: 'Josefin Sans', 'Noto Sans Kannada', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
          }

          /* View All animation */
          @keyframes flipChar {
            0%, 80% {
              transform: rotateX(0deg);
              opacity: 1;
            }
            90% {
              transform: rotateX(90deg);
              opacity: 0;
            }
            100% {
              transform: rotateX(0deg);
              opacity: 1;
            }
          }

          .flip-char {
            display: inline-block;
            transform-style: preserve-3d;
            animation: flipChar 8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }

          .flip-char-1 { animation-delay: 0s; }
          .flip-char-2 { animation-delay: 0.1s; }
          .flip-char-3 { animation-delay: 0.2s; }
          .flip-char-4 { animation-delay: 0.3s; }
          .flip-char-5 { animation-delay: 0.4s; }
          .flip-char-6 { animation-delay: 0.5s; }
          .flip-char-7 { animation-delay: 0.6s; }
          .flip-char-8 { animation-delay: 0.7s; }

          .arrow-icon {
            display: inline-block;
            transform-style: preserve-3d;
            animation: flipChar 8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            animation-delay: 0.8s;
          }
        `}</style>

        {/* Rotating Info Card with Navigation Tabs */}
        {availableCategories.length > 0 && (
          <div className="mb-4 shadow-md rounded-xl overflow-hidden">
            <RotatingInfoCard onDepartmentChange={setActiveDepartment} />
            <div className="border-t border-gray-200"></div>
            <div className="bg-white" style={{ fontFamily: "'Josefin Sans', 'Noto Sans Kannada', sans-serif" }}>
              <div ref={tabsContainerRef} className="flex items-center overflow-x-auto scrollbar-hide">
                {availableCategories.map((dept) => {
                  const deptInfo = departmentInfo[dept]
                  const count = circulars.filter(c => c.department === dept || c.department === 'All').length
                  const isActive = activeDepartment === dept
                  return (
                    <button
                      key={dept}
                      ref={isActive ? activeTabRef : null}
                      onClick={() => navigate(`/circulars?department=${dept}`)}
                      className={`flex-shrink-0 px-6 py-3.5 font-semibold transition-all border-b-3 flex items-center gap-2 ${
                        isActive
                          ? `${deptInfo.borderClass} ${deptInfo.textClass} ${deptInfo.bgClass} border-current animate-popup`
                          : `border-transparent text-gray-600 hover:${deptInfo.bgClass} hover:${deptInfo.textClass} hover:border-current`
                      }`}
                    >
                      {dept}
                      <span className={`min-w-[24px] h-[24px] flex items-center justify-center px-2 text-xs font-bold text-gray-800 ${deptInfo.bgClass.replace('bg-', 'bg-opacity-100 bg-')} rounded-full`}>
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Featured Circular */}
        {featuredCircular && (
          <div className="mb-6 animate-popup" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Josefin Sans', 'Noto Sans Kannada', sans-serif" }}>Featured Circular</h2>
              <Link
                to="/circulars"
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 text-sm view-all-link"
                style={{ fontFamily: "'Josefin Sans', 'Noto Sans Kannada', sans-serif" }}
              >
                <span className="flex">
                  <span className="flip-char flip-char-1">V</span>
                  <span className="flip-char flip-char-2">i</span>
                  <span className="flip-char flip-char-3">e</span>
                  <span className="flip-char flip-char-4">w</span>
                  <span className="flip-char flip-char-5">&nbsp;</span>
                  <span className="flip-char flip-char-6">A</span>
                  <span className="flip-char flip-char-7">l</span>
                  <span className="flip-char flip-char-8">l</span>
                </span>
                <ArrowRight className="w-4 h-4 arrow-icon" />
              </Link>
            </div>

            <div
              onClick={() => setSelectedCircular(featuredCircular)}
              className={`featured-circular-modern ${departmentInfo[featuredCircular.department].bgClass} border-l-4 ${departmentInfo[featuredCircular.department].borderClass} rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden group`}
            >
              <div className="p-5">
                {/* Header with Date */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-3 py-1.5 ${departmentInfo[featuredCircular.department].textClass} rounded-full text-xs font-bold border-2 ${departmentInfo[featuredCircular.department].borderClass}`}
                  >
                    {featuredCircular.department}
                  </span>
                  <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(featuredCircular.date)}</span>
                  </div>
                </div>

                {/* Title */}
                <h3
                  className="text-[26px] sm:text-[34px] font-bold text-gray-900 mb-2 line-clamp-2 animate-popup"
                  key={`title-${featuredAnimationKey}`}
                >
                  {featuredCircular.title}
                </h3>

                {/* Subject */}
                <p
                  className={`text-[20px] ${departmentInfo[featuredCircular.department].textClass} font-semibold mb-3 line-clamp-2 animate-popup`}
                  key={`subject-${featuredAnimationKey}`}
                  style={{ animationDelay: '0.1s' }}
                >
                  {featuredCircular.subject}
                </p>

                {/* Body Preview */}
                <div
                  className="text-[18px] text-gray-600 line-clamp-3 mb-4 animate-popup"
                  key={`body-${featuredAnimationKey}`}
                  style={{ animationDelay: '0.2s' }}
                  dangerouslySetInnerHTML={renderHtmlContent(featuredCircular.body, departmentInfo[featuredCircular.department].color)}
                />

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  {featuredCircular.attachments && featuredCircular.attachments.length > 0 ? (
                    <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                      <FileText className="w-4 h-4" />
                      <span>{featuredCircular.attachments.length} attachment(s)</span>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500">No attachments</div>
                  )}
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium group-hover:underline">
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Compact Preview Stack */}
        {circulars.length > 1 && (
          <div className="mb-5 animate-popup" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Josefin Sans', 'Noto Sans Kannada', sans-serif" }}>Quick Preview</h2>
            <CircularPreviewStack circulars={circulars} />
          </div>
        )}

        {/* Recent Circulars Preview - Only 2 */}
        {circulars.length > 1 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Josefin Sans', 'Noto Sans Kannada', sans-serif" }}>Recent Circulars</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {circulars.filter(c => c.id !== featuredCircular?.id).slice(0, 2).map((circular, index) => (
                <Link
                  key={circular.id}
                  to={`/circulars`}
                  className={`${departmentInfo[circular.department].bgClass} border-l-4 ${departmentInfo[circular.department].borderClass} rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow animate-popup`}
                  style={{ animationDelay: `${0.2 + index * 0.1}s`, fontFamily: "'Josefin Sans', 'Noto Sans Kannada', sans-serif" }}
                >
                  <div className="flex items-center justify-between mb-2">
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

      {/* Modal */}
      {selectedCircular && (
        <CircularModal
          circular={selectedCircular}
          onClose={() => {
            setSelectedCircular(null)
            navigate('/circulars')
          }}
        />
      )}
    </div>
  )
}

export default Dashboard
