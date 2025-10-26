import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Calendar, FileText, ArrowRight } from 'lucide-react'
import { circularsAPI } from '../api/client'
import { Circular, Department } from '../types'
import { departmentInfo } from '../utils/departments'
import CircularTicker from '../components/CircularTicker'
import { renderHtmlContent } from '../utils/htmlContent'
import CSVTicker from '../components/CSVTicker'

const Dashboard = () => {
  const [circulars, setCirculars] = useState<Circular[]>([])
  const [featuredCircular, setFeaturedCircular] = useState<Circular | null>(null)
  const [availableCategories, setAvailableCategories] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadCirculars()
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
        `}</style>
        {/* Compact Department Filters - Only show categories with circulars */}
        {availableCategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Category</h2>
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
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
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

                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  {featuredCircular.title}
                </h3>

                <p
                  className={`text-lg ${departmentInfo[featuredCircular.department].textClass} font-medium mb-4`}
                >
                  {featuredCircular.subject}
                </p>

                <div
                  className="prose prose-sm sm:prose max-w-none text-gray-700 leading-relaxed"
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
