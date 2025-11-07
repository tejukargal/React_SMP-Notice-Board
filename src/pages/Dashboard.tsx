import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Calendar, FileText, ArrowRight } from 'lucide-react'
import { Circular, Department } from '../types'
import { departmentInfo } from '../utils/departments'
import { renderHtmlContent } from '../utils/htmlContent'
import CircularPreviewStack from '../components/CircularPreviewStack'
import CircularModal from '../components/CircularModal'
import { useCirculars } from '../context/CircularsContext'

const Dashboard = () => {
  const { circulars, loading, error, fetchCirculars } = useCirculars()
  const [featuredCircular, setFeaturedCircular] = useState<Circular | null>(null)
  const [rotatingCirculars, setRotatingCirculars] = useState<Circular[]>([])
  const [currentRotatingIndex, setCurrentRotatingIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [availableCategories, setAvailableCategories] = useState<Department[]>([])
  const [selectedCircular, setSelectedCircular] = useState<Circular | null>(null)
  const [navDeptIndex, setNavDeptIndex] = useState(0)
  const navigate = useNavigate()

  // Rotating taglines with matching colors
  const taglines = [
    { text: 'With SMP', color: '#EC4899' }, // Pink
    { text: 'With Circulars', color: '#3B82F6' }, // Blue
    { text: 'With Exam Schedules', color: '#F97316' }, // Orange
    { text: 'With Result Schedules', color: '#84CC16' }, // Lime
    { text: 'With Fee Updates', color: '#F59E0B' }, // Amber
    { text: 'With Admissions', color: '#0EA5E9' }, // Sky
    { text: 'With Course Updates', color: '#8B5CF6' }, // Purple
    { text: 'With Office', color: '#06B6D4' }, // Cyan
  ]

  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0)

  useEffect(() => {
    fetchCirculars()

    // Auto-refresh every 5 minutes in background
    const refreshInterval = setInterval(() => {
      fetchCirculars(true)
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(refreshInterval)
  }, [])

  // Load Impact font for all devices
  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.cdnfonts.com/css/impact'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link)
      }
    }
  }, [])

  // Rotate tagline every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTaglineIndex((prev) => (prev + 1) % taglines.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Handle back button for modal only
  useEffect(() => {
    if (!selectedCircular) return

    const handlePopState = () => {
      // Close modal and navigate to All Circulars
      setSelectedCircular(null)
      navigate('/circulars')
    }

    // Push a state entry when modal opens
    window.history.pushState(null, '', '/')

    // Listen for back button
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [selectedCircular, navigate])

  // Handle back button on dashboard (without modal) to exit app
  useEffect(() => {
    const handlePopState = () => {
      // Only exit if we're on the dashboard page and no modal is open
      if (window.location.pathname === '/' && !selectedCircular) {
        // Exit app directly without confirmation
        window.close()

        // Fallback if window.close() doesn't work
        setTimeout(() => {
          if (!window.closed) {
            window.location.href = 'about:blank'
          }
        }, 100)
      }
    }

    // Listen for back button
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [selectedCircular])

  // Push initial history state on mount only
  useEffect(() => {
    window.history.pushState(null, '', window.location.pathname)
  }, [])

  // Update featured circular and categories when circulars change
  useEffect(() => {
    if (circulars.length > 0) {
      // Find featured circular or use latest
      const featured = circulars.find(c => c.is_featured) || circulars[0]
      setFeaturedCircular(featured)

      // Prepare 3 circulars for rotation: featured + 2 recent (excluding featured)
      const recentCirculars = circulars.filter(c => c.id !== featured.id).slice(0, 2)
      const circularsToRotate = [featured, ...recentCirculars]
      setRotatingCirculars(circularsToRotate)
      setCurrentRotatingIndex(0)

      // Get unique categories that have circulars
      const uniqueCategories = Array.from(new Set(circulars.map(c => c.department)))
      // Filter out 'All' from the list
      const categoriesWithoutAll = uniqueCategories.filter(cat => cat !== 'All')
      // Add 'All' at the beginning
      const allCategories = ['All' as Department, ...categoriesWithoutAll as Department[]]
      setAvailableCategories(allCategories)
    }
  }, [circulars])

  // Rotate through departments for navigation tabs every 3 seconds
  useEffect(() => {
    if (availableCategories.length === 0) return

    const interval = setInterval(() => {
      setNavDeptIndex((prev) => (prev + 1) % availableCategories.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [availableCategories])

  // Rotate through featured circulars every 5 seconds with smooth transition
  useEffect(() => {
    if (rotatingCirculars.length <= 1) return

    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentRotatingIndex((prev) => (prev + 1) % rotatingCirculars.length)
        setIsTransitioning(false)
      }, 400) // Half of transition duration
    }, 5000)

    return () => clearInterval(interval)
  }, [rotatingCirculars])

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
          <p className="text-gray-600 text-lg font-medium">Connecting...</p>
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
          <h1
            className="text-3xl font-bold text-gray-900 mb-2 min-h-[2.5rem] flex items-center"
            style={{ fontFamily: "'Josefin Sans', 'Noto Sans Kannada', sans-serif" }}
          >
            Dashboard
          </h1>
          <p className="text-gray-600 flex items-center gap-2 min-h-[1.75rem]">
            <span className="font-semibold">CONNECT</span>
            <span
              className="tagline-animate font-semibold gradient-text"
              key={currentTaglineIndex}
            >
              {taglines[currentTaglineIndex].text}
            </span>
          </p>
        </div>

        {/* Rotating Info Card with Navigation Filter */}
        {availableCategories.length > 0 && (() => {
          const currentLabel = availableCategories[navDeptIndex % availableCategories.length]
          const isFeatured = currentLabel === 'All'
          const currentDeptInfo = isFeatured ? null : departmentInfo[currentLabel as Department]
          const bgClass = isFeatured ? 'bg-gray-50' : currentDeptInfo?.bgClass
          const textClass = isFeatured ? 'text-gray-900' : currentDeptInfo?.textClass
          const borderClass = isFeatured ? 'border-gray-900' : currentDeptInfo?.borderClass

          return (
            <div
              className={`mb-4 shadow-md rounded-xl overflow-hidden transition-all duration-1000 ease-in-out ${bgClass} border-l-4 ${borderClass}`}
            >
              {/* SMP CONNECT Banner */}
              <div className="relative h-[52px] flex items-center justify-center px-3 sm:px-4 lg:px-6 overflow-hidden transition-colors duration-1000 ease-in-out">
                <div
                  className="smp-board-title banner-slide-in transition-colors duration-1000 ease-in-out"
                  style={{
                    fontFamily: "'Impact', 'Arial Black', 'Helvetica Neue', Arial, sans-serif",
                    color: isFeatured ? '#1f2937' : currentDeptInfo?.color
                  }}
                >
                  SMP CONNECT
                </div>
              </div>

              {/* Separator */}
              <div className="border-t border-gray-200"></div>

              {/* Navigation Filter Label */}
              <button
                onClick={() => {
                  if (currentLabel === 'All') {
                    navigate('/circulars')
                  } else {
                    navigate(`/circulars?department=${currentLabel}`)
                  }
                }}
                className="w-full relative group cursor-pointer hover:opacity-90 transition-opacity duration-300"
                style={{
                  fontFamily: "'Josefin Sans', 'Noto Sans Kannada', sans-serif"
                }}
              >
                <div className="h-[52px] flex items-center justify-center px-6 overflow-hidden">
                  <h2
                    key={navDeptIndex}
                    className={`text-3xl sm:text-4xl font-bold filter-label-slide underline decoration-1 underline-offset-4 text-center ${textClass}`}
                  >
                    {currentLabel}
                  </h2>
                </div>
              </button>
            </div>
          )
        })()}

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

          @keyframes slideFromRight {
            0% {
              transform: translateX(100%);
              opacity: 0;
            }
            100% {
              transform: translateX(0);
              opacity: 1;
            }
          }

          .banner-slide-in {
            animation: slideFromRight 0.5s ease-out forwards;
          }

          .smp-board-title {
            font-family: 'Impact', 'Arial Black', 'Helvetica Neue', Arial, sans-serif !important;
            font-size: 2.125rem !important; /* 34px - All devices */
            font-weight: 900 !important;
            letter-spacing: 0.025em;
            line-height: 1.2;
            text-transform: uppercase;
            white-space: nowrap !important;
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
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

          .tagline-animate {
            animation: fadeInOut 5s ease-in-out;
          }

          .gradient-text {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
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

          @keyframes filterLabelSlide {
            0% {
              opacity: 0;
              transform: translateY(-20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .filter-label-slide {
            animation: filterLabelSlide 0.8s ease-out forwards;
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

        {/* Featured Circular - Rotating with Quick Preview Style */}
        {rotatingCirculars.length > 0 && (() => {
          const currentCircular = rotatingCirculars[currentRotatingIndex]
          const nextCircular = rotatingCirculars[(currentRotatingIndex + 1) % rotatingCirculars.length]
          const currentDeptInfo = departmentInfo[currentCircular.department]
          const nextDeptInfo = departmentInfo[nextCircular.department]

          return (
            <div className="mb-6 animate-popup" style={{ animationDelay: '0.1s' }}>
              <style>{`
                @keyframes featuredTextSlideOut {
                  0% {
                    transform: translateX(0);
                    opacity: 1;
                  }
                  100% {
                    transform: translateX(-30px);
                    opacity: 0;
                  }
                }

                @keyframes featuredTextSlideIn {
                  0% {
                    transform: translateX(30px);
                    opacity: 0;
                  }
                  100% {
                    transform: translateX(0);
                    opacity: 1;
                  }
                }

                @keyframes featuredStackSlideLeft {
                  0% {
                    transform: translateX(0);
                    opacity: 0.5;
                  }
                  100% {
                    transform: translateX(-8px);
                    opacity: 0.3;
                  }
                }

                @keyframes featuredStackSlideIn {
                  0% {
                    transform: translateX(8px);
                    opacity: 0.3;
                  }
                  100% {
                    transform: translateX(0);
                    opacity: 0.5;
                  }
                }

                .featured-text-exit {
                  animation: featuredTextSlideOut 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }

                .featured-text-enter {
                  animation: featuredTextSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }

                .featured-stack-text-exit {
                  animation: featuredStackSlideLeft 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }

                .featured-stack-text-enter {
                  animation: featuredStackSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }
              `}</style>

              <div className="flex items-center justify-between mb-3">
                <h2
                  className="text-xl font-bold text-gray-900"
                  style={{ fontFamily: "'Josefin Sans', 'Noto Sans Kannada', sans-serif" }}
                >
                  Featured Circular
                </h2>
                <Link
                  to='/circulars'
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

              <div className="relative featured-circular-modern" style={{ fontFamily: "'Josefin Sans', 'Noto Sans Kannada', sans-serif" }}>
                <div
                  onClick={() => setSelectedCircular(currentCircular)}
                  className={`relative ${currentDeptInfo.bgClass} border-l-4 ${currentDeptInfo.borderClass} rounded-xl shadow-lg overflow-hidden transition-all duration-700 cursor-pointer hover:shadow-xl`}
                >
                  {/* Header - Title, Date, Department */}
                  <div className="px-5 pt-5 pb-3 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`px-3 py-1.5 ${currentDeptInfo.textClass} rounded-full text-xs font-bold border-2 ${currentDeptInfo.borderClass}`}
                      >
                        {currentCircular.department}
                      </span>
                      <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(currentCircular.date)}</span>
                      </div>
                    </div>
                    <h3 className="text-[22px] sm:text-[28px] font-bold text-gray-900 line-clamp-2">
                      {currentCircular.title}
                    </h3>
                  </div>

                  {/* Body - Subject and Content with layered effect */}
                  <div className="relative h-[200px] sm:h-[180px]">
                    {/* Background/Stacked layer - Next circular preview */}
                    {rotatingCirculars.length > 1 && (
                      <div className="absolute inset-0 p-5">
                        {/* Next Subject */}
                        <div
                          className={`text-base font-bold mb-2 ${nextDeptInfo.textClass} opacity-40 ${
                            isTransitioning ? 'featured-stack-text-exit' : 'featured-stack-text-enter'
                          }`}
                          style={{
                            transform: 'translateX(8px)',
                            filter: 'blur(0.5px)',
                          }}
                          key={`stack-subject-${nextCircular.id}`}
                        >
                          {nextCircular.subject}
                        </div>
                        {/* Next Body */}
                        <div
                          className={`text-sm text-justify leading-relaxed line-clamp-5 sm:line-clamp-4 opacity-40 ${
                            isTransitioning ? 'featured-stack-text-exit' : 'featured-stack-text-enter'
                          }`}
                          style={{
                            transform: 'translateX(8px)',
                            filter: 'blur(0.5px)',
                          }}
                          key={`stack-body-${nextCircular.id}`}
                          dangerouslySetInnerHTML={renderHtmlContent(nextCircular.body, nextDeptInfo.color)}
                        />
                      </div>
                    )}

                    {/* Main layer - Current circular */}
                    <div className="absolute inset-0 p-5 bg-gradient-to-br from-white/95 to-white/90">
                      {/* Current Subject */}
                      <div
                        className={`text-base font-bold mb-2 ${currentDeptInfo.textClass} ${
                          isTransitioning ? 'featured-text-exit' : 'featured-text-enter'
                        }`}
                        key={`main-subject-${currentCircular.id}`}
                      >
                        {currentCircular.subject}
                      </div>
                      {/* Current Body */}
                      <div
                        className={`text-sm text-justify text-gray-600 leading-relaxed line-clamp-5 sm:line-clamp-4 ${
                          isTransitioning ? 'featured-text-exit' : 'featured-text-enter'
                        }`}
                        key={`main-body-${currentCircular.id}`}
                        dangerouslySetInnerHTML={renderHtmlContent(currentCircular.body, currentDeptInfo.color)}
                      />
                    </div>
                  </div>

                  {/* Footer - Attachments and View Details */}
                  <div className={`px-5 pb-3 pt-3 ${currentDeptInfo.bgClass} border-t ${currentDeptInfo.borderClass} transition-all duration-700`}>
                    <div className="flex items-center justify-between">
                      {currentCircular.attachments && currentCircular.attachments.length > 0 ? (
                        <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                          <FileText className="w-4 h-4" />
                          <span>{currentCircular.attachments.length} attachment(s)</span>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500">No attachments</div>
                      )}
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline">
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Pagination dots */}
                {rotatingCirculars.length > 1 && (
                  <div className="flex justify-center gap-2 mt-3">
                    {rotatingCirculars.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsTransitioning(true)
                          setTimeout(() => {
                            setCurrentRotatingIndex(index)
                            setIsTransitioning(false)
                          }, 600)
                        }}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index === currentRotatingIndex
                            ? `w-8 ${currentDeptInfo.textClass} bg-current`
                            : 'w-2 bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to circular ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })()}

        {/* Compact Preview Stack */}
        {circulars.length > 1 && (
          <div className="mb-5 animate-popup" style={{ animationDelay: '0.15s' }}>
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
                  to={`/circulars?department=${circular.department}`}
                  className={`${departmentInfo[circular.department].bgClass} border-l-4 ${departmentInfo[circular.department].borderClass} rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow animate-popup`}
                  style={{ animationDelay: `${0.25 + index * 0.1}s`, fontFamily: "'Josefin Sans', 'Noto Sans Kannada', sans-serif" }}
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
          onClose={() => setSelectedCircular(null)}
        />
      )}
    </div>
  )
}

export default Dashboard
