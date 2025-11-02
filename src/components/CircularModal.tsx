import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { X, Calendar, FileText, Download } from 'lucide-react'
import { Circular } from '../types'
import { departmentInfo } from '../utils/departments'
import { renderHtmlContent } from '../utils/htmlContent'
import CSVTicker from './CSVTicker'

interface CircularModalProps {
  circular: Circular
  onClose: () => void
}

const CircularModal = ({ circular, onClose }: CircularModalProps) => {
  const navigate = useNavigate()
  const info = departmentInfo[circular.department]

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  // Handle back button/gesture to navigate to All Circulars
  useEffect(() => {
    const handlePopState = () => {
      navigate('/circulars')
      onClose()
    }

    // Push a state entry so back button triggers popstate
    window.history.pushState(null, '', window.location.pathname)

    // Listen for back button/gesture
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [navigate, onClose])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  // Helper function to check if a file is CSV
  const isCSVFile = (file: { name: string; type: string }) => {
    const fileName = file.name.toLowerCase().trim()
    const fileType = file.type.toLowerCase()
    return fileName.endsWith('.csv') || fileType.includes('csv')
  }

  // Handle close with navigation to All Circulars
  const handleClose = () => {
    navigate('/circulars')
    onClose()
  }

  // Debug logging
  console.log('Circular attachments:', circular.attachments)

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={handleClose}
      style={{ zIndex: 9999 }}
    >
      <style>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes popup {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-popup {
          animation: popup 0.6s ease-out forwards;
        }
      `}</style>
      <div
        className="bg-white rounded-2xl max-w-3xl w-full h-[85vh] flex flex-col animate-popup"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className={`${info.bgClass} border-b-4 ${info.borderClass} px-6 py-5 flex-shrink-0`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                <span
                  className={`px-4 py-1.5 ${info.textClass} rounded-full text-sm font-bold border-2 ${info.borderClass} w-fit`}
                >
                  {circular.department}
                </span>
                <div className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm whitespace-nowrap">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{formatDate(circular.date)}</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{circular.title}</h2>
            </div>
            <button
              onClick={handleClose}
              className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="px-6 py-6 overflow-y-auto flex-1">
          {/* Subject */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              Subject
            </h3>
            <p className={`text-xl font-semibold ${info.textClass}`}>
              {circular.subject}
            </p>
          </div>

          {/* Body */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
              Details
            </h3>
            <div
              className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={renderHtmlContent(circular.body, info.color)}
            />
          </div>

          {/* CSV Ticker Preview */}
          {circular.attachments && circular.attachments.some(file => isCSVFile(file)) && (
            <div className="mb-6">
              {circular.attachments
                .filter(file => isCSVFile(file))
                .map((file, index) => (
                  <CSVTicker
                    key={index}
                    csvBase64={file.base64}
                    fileName={file.name}
                    department={circular.department}
                  />
                ))}
            </div>
          )}

          {/* Attachments - Exclude CSV files as they are shown in ticker */}
          {circular.attachments && circular.attachments.filter(file => !isCSVFile(file)).length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                Attachments ({circular.attachments.filter(file => !isCSVFile(file)).length})
              </h3>
              <div className="space-y-3">
                {circular.attachments
                  .filter(file => !isCSVFile(file))
                  .map((file, index) => (
                    <a
                      key={index}
                      href={file.base64}
                      download={file.name}
                      className={`flex items-center gap-3 p-4 bg-transparent border-2 ${info.borderClass} rounded-lg hover:shadow-md transition group`}
                    >
                      <FileText className={`w-10 h-10 ${info.textClass} flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium ${info.textClass} truncate`}>
                          {file.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {file.type} • {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      <Download className={`w-5 h-5 ${info.textClass} opacity-70 flex-shrink-0`} />
                    </a>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer - Fixed */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
          <button
            onClick={handleClose}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default CircularModal
