import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { circularsAPI } from '../api/client'
import { Circular, Department } from '../types'
import { departments } from '../utils/departments'
import CircularCard from '../components/CircularCard'
import CircularModal from '../components/CircularModal'

const AllCirculars = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [circulars, setCirculars] = useState<Circular[]>([])
  const [filteredCirculars, setFilteredCirculars] = useState<Circular[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState<Department | 'All'>('All')
  const [selectedCircular, setSelectedCircular] = useState<Circular | null>(null)

  useEffect(() => {
    const dept = searchParams.get('department') as Department
    if (dept && departments.includes(dept)) {
      setSelectedDepartment(dept)
    }
    loadCirculars()
  }, [])

  useEffect(() => {
    filterCirculars()
  }, [circulars, selectedDepartment])

  const loadCirculars = async () => {
    try {
      const data = await circularsAPI.getAll()
      setCirculars(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filterCirculars = () => {
    if (selectedDepartment === 'All') {
      setFilteredCirculars(circulars)
    } else {
      setFilteredCirculars(
        circulars.filter(
          (c) => c.department === selectedDepartment || c.department === 'All'
        )
      )
    }
  }

  const handleDepartmentChange = (dept: Department | 'All') => {
    setSelectedDepartment(dept)
    if (dept !== 'All') {
      setSearchParams({ department: dept })
    } else {
      setSearchParams({})
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading circulars...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Circulars</h1>
          <p className="text-gray-600">Browse all notices and circulars</p>
        </div>

        {/* Compact Tab Filter */}
        <div className="mb-6 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center overflow-x-auto scrollbar-hide">
            <button
              onClick={() => handleDepartmentChange('All')}
              className={`flex-shrink-0 px-6 py-4 font-medium transition border-b-2 ${
                selectedDepartment === 'All'
                  ? 'border-gray-900 text-gray-900 bg-gray-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            {departments.filter((d) => d !== 'All').map((dept) => (
              <button
                key={dept}
                onClick={() => handleDepartmentChange(dept)}
                className={`flex-shrink-0 px-6 py-4 font-medium transition border-b-2 ${
                  selectedDepartment === dept
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredCirculars.length} circular(s)
          </p>
        </div>

        {/* Circulars Grid */}
        {filteredCirculars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCirculars.map((circular) => (
              <CircularCard
                key={circular.id}
                circular={circular}
                onClick={() => setSelectedCircular(circular)}
              />
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
          onClose={() => setSelectedCircular(null)}
        />
      )}
    </div>
  )
}

export default AllCirculars
