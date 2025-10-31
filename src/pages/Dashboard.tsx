import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Calendar, FileText, ArrowRight } from 'lucide-react'
import { Circular, Department } from '../types'
import { departmentInfo } from '../utils/departments'
import CircularTicker from '../components/CircularTicker'
import { renderHtmlContent } from '../utils/htmlContent'
import CSVTicker from '../components/CSVTicker'
import CircularPreviewStack from '../components/CircularPreviewStack'
import RotatingInfoCard from '../components/RotatingInfoCard'
import { useCirculars } from '../context/CircularsContext'

const Dashboard = () => {
  const { circulars, loading, error, fetchCirculars } = useCirculars()
  const [featuredCircular, setFeaturedCircular] = useState<Circular | null>(null)
  const [availableCategories, setAvailableCategories] = useState<Department[]>([])
  const [featuredAnimationKey, setFeaturedAnimationKey] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCirculars()
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

  // Re-trigger featured circular animations every 15 seconds
  useEffect(() => {
    if (!featuredCircular) return

    const interval = setInterval(() => {
      setFeaturedAnimationKey(prev => prev + 1)
    }, 15000)

    return () => clearInterval(interval)
  }, [featuredCircular])

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

          /* Featured circular modern font - Josefin Sans for English, Noto Sans Kannada for Kannada */
          .featured-circular-modern {
            font-family: 'Josefin Sans', 'Noto Sans Kannada', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
          }

          /* Featured circular animations - supports all scripts including Kannada */
          @keyframes scaleBlurFade {
            0% {
              opacity: 0;
              transform: scale(0.94) translateY(20px);
              filter: blur(8px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
              filter: blur(0);
            }
          }

          .featured-title {
            position: relative;
            opacity: 0;
            animation: scaleBlurFade 1.2s ease-out forwards;
            letter-spacing: -0.02em;
            font-weight: 800;
          }

          .featured-subject {
            position: relative;
            opacity: 0;
            animation: scaleBlurFade 1.2s ease-out 0.3s forwards;
            letter-spacing: -0.01em;
            font-weight: 600;
          }

          .featured-body {
            position: relative;
            opacity: 0;
            animation: scaleBlurFade 1.2s ease-out 0.6s forwards;
            letter-spacing: -0.005em;
          }

          /* Mobile: Ensure proper display */
          @media (max-width: 640px) {
            .featured-body {
              white-space: normal !important;
              overflow: visible !important;
              width: 100% !important;
            }

            .featured-title,
            .featured-subject {
              white-space: normal;
              overflow: visible;
              width: 100%;
            }
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
            <RotatingInfoCard />
            <div className="border-t border-gray-200"></div>
            <div className="bg-white" style={{ fontFamily: "'Josefin Sans', 'Noto Sans Kannada', sans-serif" }}>
              <div className="flex items-center overflow-x-auto scrollbar-hide">
                {availableCategories.map((dept) => {
                  const deptInfo = departmentInfo[dept]
                  const count = circulars.filter(c => c.department === dept || c.department === 'All').length
                  return (
                    <button
                      key={dept}
                      onClick={() => navigate(`/circulars?department=${dept}`)}
                      className={`flex-shrink-0 px-6 py-3.5 font-semibold transition-all border-b-3 border-transparent hover:${deptInfo.bgClass} ${deptInfo.textClass} hover:border-current flex items-center gap-2`}
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
              className={`featured-circular-modern ${departmentInfo[featuredCircular.department].bgClass} border-l-4 ${departmentInfo[featuredCircular.department].borderClass} rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow`}
            >
              <div className="p-4 sm:p-8">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-4 py-1.5 ${departmentInfo[featuredCircular.department].bgClass} ${departmentInfo[featuredCircular.department].textClass} rounded-full text-sm font-semibold border-2 ${departmentInfo[featuredCircular.department].borderClass}`}
                    >
                      {featuredCircular.department}
                    </span>
                    <div className="flex items-center gap-2 text-gray-600 text-base">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(featuredCircular.date)}</span>
                    </div>
                  </div>
                  {featuredCircular.attachments && featuredCircular.attachments.filter(file => !file.name.toLowerCase().trim().endsWith('.csv')).length > 0 && (
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                      <FileText className="w-4 h-4" />
                      <span>{featuredCircular.attachments.filter(file => !file.name.toLowerCase().trim().endsWith('.csv')).length} attachment(s)</span>
                    </div>
                  )}
                </div>

                <h3
                  className="text-[26px] sm:text-[34px] font-bold text-gray-900 mb-3 featured-title"
                  key={`title-${featuredAnimationKey}`}
                >
                  {featuredCircular.title}
                </h3>

                <p
                  className={`text-[20px] ${departmentInfo[featuredCircular.department].textClass} font-medium mb-4 featured-subject`}
                  key={`subject-${featuredAnimationKey}`}
                >
                  {featuredCircular.subject}
                </p>

                <div
                  className="prose prose-sm sm:prose max-w-none text-gray-700 leading-relaxed [&>*]:text-[18px] [&>*]:font-bold featured-body"
                  key={`body-${featuredAnimationKey}`}
                  dangerouslySetInnerHTML={renderHtmlContent(featuredCircular.body, departmentInfo[featuredCircular.department].color, departmentInfo[featuredCircular.department].lightColor)}
                />

                {/* CSV Ticker Preview */}
                {featuredCircular.attachments && featuredCircular.attachments.some(file => file.name.toLowerCase().endsWith('.csv')) && (
                  <div className="mt-6">
                    {featuredCircular.attachments
                      .filter(file => file.name.toLowerCase().endsWith('.csv'))
                      .map((file, index) => (
                        <CSVTicker
                          key={index}
                          csvBase64={file.base64}
                          fileName={file.name}
                          department={featuredCircular.department}
                        />
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
                            className={`flex items-center gap-3 p-3 bg-transparent border-2 ${departmentInfo[featuredCircular.department].borderClass} rounded-lg hover:shadow-md transition group`}
                          >
                            <FileText className={`w-8 h-8 ${departmentInfo[featuredCircular.department].textClass} flex-shrink-0`} />
                            <div className="flex-1 min-w-0">
                              <p className={`font-medium ${departmentInfo[featuredCircular.department].textClass} truncate`}>
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-600">
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
    </div>
  )
}

export default Dashboard
