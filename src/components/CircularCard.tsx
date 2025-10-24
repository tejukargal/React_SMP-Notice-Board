import { Calendar, FileText } from 'lucide-react'
import { Circular } from '../types'
import { departmentInfo } from '../utils/departments'

interface CircularCardProps {
  circular: Circular
  onClick: () => void
}

const CircularCard = ({ circular, onClick }: CircularCardProps) => {
  const info = departmentInfo[circular.department]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div
      onClick={onClick}
      className={`${info.bgClass} border-l-4 ${info.borderClass} rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden group`}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <span
            className={`px-3 py-1.5 ${info.textClass} rounded-full text-xs font-bold border-2 ${info.borderClass}`}
          >
            {circular.department}
          </span>
          <div className="flex items-center gap-1.5 text-gray-600 text-xs">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(circular.date)}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition">
          {circular.title}
        </h3>

        {/* Subject */}
        <p className={`text-sm ${info.textClass} font-semibold mb-3 line-clamp-2`}>
          {circular.subject}
        </p>

        {/* Body Preview */}
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {circular.body}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          {circular.attachments && circular.attachments.length > 0 ? (
            <div className="flex items-center gap-1.5 text-gray-600 text-xs">
              <FileText className="w-4 h-4" />
              <span>{circular.attachments.length} attachment(s)</span>
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
  )
}

export default CircularCard
