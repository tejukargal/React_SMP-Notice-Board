import { X, Download, ZoomIn, ZoomOut } from 'lucide-react'
import { useState } from 'react'

interface AttachmentPreviewProps {
  file: {
    name: string
    type: string
    base64: string
    size: number
  }
  onClose: () => void
}

const AttachmentPreview = ({ file, onClose }: AttachmentPreviewProps) => {
  const [zoom, setZoom] = useState(100)

  const isPDF = file.name.toLowerCase().endsWith('.pdf') || file.type.toLowerCase().includes('pdf')
  const isImage = file.name.toLowerCase().match(/\.(jpg|jpeg|png)$/i) || file.type.toLowerCase().includes('image')

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4">
      <div className="relative w-full max-w-6xl max-h-[95vh] bg-white rounded-lg shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <div className="flex-1 min-w-0 mr-4">
            <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
              {file.name}
            </h3>
            <p className="text-xs text-gray-500">
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Zoom controls for images */}
            {isImage && (
              <div className="hidden sm:flex items-center gap-2 mr-2">
                <button
                  onClick={handleZoomOut}
                  disabled={zoom <= 50}
                  className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Zoom out"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-600 min-w-[3rem] text-center">
                  {zoom}%
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoom >= 200}
                  className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Zoom in"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
              </div>
            )}
            {/* Download button */}
            <a
              href={file.base64}
              download={file.name}
              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </a>
            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-100">
          {isPDF ? (
            <object
              data={`${file.base64}#toolbar=0&navpanes=0&scrollbar=1`}
              type="application/pdf"
              className="w-full h-full min-h-[60vh] sm:min-h-[70vh]"
              aria-label={file.name}
            >
              <iframe
                src={`${file.base64}#toolbar=0&navpanes=0&scrollbar=1`}
                className="w-full h-full min-h-[60vh] sm:min-h-[70vh] border-0"
                title={file.name}
              >
                <div className="flex items-center justify-center p-8 min-h-[60vh]">
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">Unable to display PDF. Please download to view.</p>
                    <a
                      href={file.base64}
                      download={file.name}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </a>
                  </div>
                </div>
              </iframe>
            </object>
          ) : isImage ? (
            <div className="flex items-center justify-center p-4 min-h-[60vh] sm:min-h-[70vh]">
              <img
                src={file.base64}
                alt={file.name}
                className="max-w-full h-auto rounded-lg shadow-lg transition-transform"
                style={{ transform: `scale(${zoom / 100})` }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center p-8 min-h-[60vh]">
              <div className="text-center">
                <p className="text-gray-600 mb-4">Preview not available for this file type.</p>
                <a
                  href={file.base64}
                  download={file.name}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Download className="w-4 h-4" />
                  Download File
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Mobile zoom controls for images */}
        {isImage && (
          <div className="flex sm:hidden items-center justify-center gap-4 p-3 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-600 min-w-[3rem] text-center">
              {zoom}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AttachmentPreview
