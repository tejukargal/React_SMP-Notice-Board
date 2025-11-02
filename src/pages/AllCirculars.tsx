import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Department } from '../types'
import { departments, departmentInfo } from '../utils/departments'
import CircularCard from '../components/CircularCard'
import CircularModal from '../components/CircularModal'
import RotatingInfoCard from '../components/RotatingInfoCard'
import { useCirculars } from '../context/CircularsContext'
import type { Circular } from '../types'

const AllCirculars = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { circulars, loading, error, fetchCirculars } = useCirculars()
  const [selectedDepartment, setSelectedDepartment] = useState<Department | 'All'>('All')
  const [selectedCircular, setSelectedCircular] = useState<Circular | null>(null)
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    const dept = searchParams.get('department') as Department
    if (dept && departments.includes(dept)) {
      setSelectedDepartment(dept)
    }
    fetchCirculars()
  }, [])

  // Handle back button when modal is open
  useEffect(() => {
    // Only handle back button when modal is open
    if (!selectedCircular) return

    const handlePopState = () => {
      // Close modal and stay on All Circulars
      setSelectedCircular(null)
      // Trigger animation when returning from modal
      setAnimationKey(prev => prev + 1)
      // Don't call navigate here - let browser handle the history naturally
    }

    // Push a state entry when modal opens
    window.history.pushState(null, '', '/circulars')

    // Listen for back button
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [selectedCircular])

  // Use useMemo to optimize filtering
  const filteredCirculars = useMemo(() => {
    if (selectedDepartment === 'All') {
      return circulars
    }
    return circulars.filter(
      (c) => c.department === selectedDepartment || c.department === 'All'
    )
  }, [circulars, selectedDepartment])

  const handleDepartmentChange = (dept: Department | 'All') => {
    setSelectedDepartment(dept)
    if (dept !== 'All') {
      setSearchParams({ department: dept }, { replace: true })
    } else {
      setSearchParams({}, { replace: true })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="loader mb-4 mx-auto"></div>
          <p className="text-gray-600">Loading circulars...</p>
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
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        {/* Header */}
        <div className="mb-4 animate-popup" style={{ animationDelay: '0s' }}>
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Josefin Sans', 'Noto Sans Kannada', sans-serif" }}>All Circulars</h1>
          <p className="text-gray-600">Browse all notices and circulars</p>
        </div>

        {/* Rotating Info Card with Navigation Tabs */}
        <div className="mb-4 shadow-md rounded-xl overflow-hidden">
          <RotatingInfoCard />
          <div className="border-t border-gray-200"></div>
          <div className="bg-white">
            <div className="flex items-center overflow-x-auto scrollbar-hide">
              <button
                onClick={() => handleDepartmentChange('All')}
                className={`flex-shrink-0 px-6 py-3.5 font-semibold transition-all border-b-3 flex items-center gap-2 ${
                  selectedDepartment === 'All'
                    ? 'border-gray-900 text-gray-900 bg-gray-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                All
                <span className="min-w-[24px] h-[24px] flex items-center justify-center px-2 text-xs font-bold text-gray-100 bg-gray-900 rounded-full">
                  {circulars.length}
                </span>
              </button>
              {departments.filter((d) => d !== 'All').map((dept) => {
                const deptInfo = departmentInfo[dept]
                const count = circulars.filter(c => c.department === dept || c.department === 'All').length
                return (
                  <button
                    key={dept}
                    onClick={() => handleDepartmentChange(dept)}
                    className={`flex-shrink-0 px-6 py-3.5 font-semibold transition-all border-b-3 flex items-center gap-2 ${
                      selectedDepartment === dept
                        ? `${deptInfo.borderClass} ${deptInfo.textClass} ${deptInfo.bgClass} border-current`
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

        {/* Results Count */}
        <div className="mb-3">
          <p className="text-sm text-gray-600">
            Showing {filteredCirculars.length} circular(s)
          </p>
        </div>

        {/* Circulars Grid */}
        {filteredCirculars.length > 0 ? (
          <div key={animationKey} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCirculars.map((circular, index) => (
              <div
                key={circular.id}
                className="animate-popup"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CircularCard
                  circular={circular}
                  onClick={() => setSelectedCircular(circular)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-600 text-lg">
              No circulars found for the selected department.
            </p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedCircular && (
        <CircularModal
          circular={selectedCircular}
          onClose={() => {
            setSelectedCircular(null)
            // Trigger animation when closing modal
            setAnimationKey(prev => prev + 1)
          }}
        />
      )}
    </div>
  )
}

export default AllCirculars
