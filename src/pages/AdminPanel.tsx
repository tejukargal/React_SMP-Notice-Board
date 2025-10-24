import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, AlertCircle, Star } from 'lucide-react'
import { circularsAPI } from '../api/client'
import { Circular } from '../types'
import { departmentInfo } from '../utils/departments'
import CircularForm from '../components/CircularForm'

const AdminPanel = () => {
  const [circulars, setCirculars] = useState<Circular[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingCircular, setEditingCircular] = useState<Circular | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    loadCirculars()
  }, [])

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

  const handleDelete = async (id: string) => {
    try {
      await circularsAPI.delete(id)
      setCirculars(circulars.filter((c) => c.id !== id))
      setDeleteConfirm(null)
    } catch (err: any) {
      alert('Failed to delete circular: ' + err.message)
    }
  }

  const handleEdit = (circular: Circular) => {
    setEditingCircular(circular)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingCircular(null)
    loadCirculars()
  }

  const handleToggleFeatured = async (id: string) => {
    try {
      await circularsAPI.toggleFeatured(id)
      loadCirculars()
    } catch (err: any) {
      alert('Failed to set as featured: ' + err.message)
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
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
            <p className="text-gray-600">Manage circulars and notices</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Circular
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Circulars List */}
        {circulars.length > 0 ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Featured
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Title & Subject
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Attachments
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {circulars.map((circular) => (
                    <tr key={circular.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleToggleFeatured(circular.id)}
                          className={`p-2 rounded-lg transition ${
                            circular.is_featured
                              ? 'text-yellow-500 hover:text-yellow-600'
                              : 'text-gray-300 hover:text-yellow-500'
                          }`}
                          title={circular.is_featured ? 'Featured' : 'Set as Featured'}
                        >
                          <Star
                            className={`w-5 h-5 ${circular.is_featured ? 'fill-current' : ''}`}
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1.5 ${departmentInfo[circular.department].bgClass} ${departmentInfo[circular.department].textClass} rounded-full text-xs font-bold border-2 ${departmentInfo[circular.department].borderClass}`}
                        >
                          {circular.department}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-md">
                          <p className="font-semibold text-gray-900 line-clamp-1">
                            {circular.title}
                          </p>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {circular.subject}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(circular.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {circular.attachments?.length || 0} file(s)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          {deleteConfirm === circular.id ? (
                            <>
                              <button
                                onClick={() => handleDelete(circular.id)}
                                className="px-3 py-1.5 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 transition"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded text-xs font-medium hover:bg-gray-400 transition"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(circular)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(circular.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <p className="text-gray-600 text-lg mb-4">No circulars yet.</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
            >
              <Plus className="w-5 h-5" />
              Add Your First Circular
            </button>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <CircularForm
          circular={editingCircular}
          onClose={handleFormClose}
        />
      )}
    </div>
  )
}

export default AdminPanel
