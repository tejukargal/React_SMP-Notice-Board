import { useEffect, useState } from 'react'
import { Pause, Play } from 'lucide-react'

interface CSVTickerProps {
  csvBase64: string
  fileName: string
}

const CSVTicker = ({ csvBase64, fileName: _fileName }: CSVTickerProps) => {
  const [csvData, setCsvData] = useState<string[][]>([])
  const [error, setError] = useState<string>('')
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    parseCSV()
  }, [csvBase64])

  const parseCSV = () => {
    try {
      // Extract base64 data (remove data URL prefix if present)
      const base64Data = csvBase64.includes(',')
        ? csvBase64.split(',')[1]
        : csvBase64

      // Decode base64 to text
      const csvText = atob(base64Data)

      // Parse CSV (simple parsing - handles basic CSV format)
      const rows = csvText.split('\n').filter(row => row.trim())
      const parsedData = rows.map(row => {
        // Handle both comma and tab separated values
        return row.split(/,|\t/).map(cell => cell.trim())
      })

      // Get all rows (no limit for student data)
      setCsvData(parsedData)
      console.log(`CSV parsed: ${parsedData.length} total rows (including header)`, parsedData)
    } catch (err) {
      console.error('CSV parsing error:', err)
      setError('Failed to parse CSV file')
    }
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
        {error}
      </div>
    )
  }

  if (csvData.length === 0) {
    return null
  }

  const headers = csvData[0]
  const dataRows = csvData.slice(1)

  // Dynamic scrolling speed for easy readability - 12 seconds per row (reduced speed)
  // Minimum 48 seconds, maximum 216 seconds
  const scrollSpeed = Math.min(Math.max(dataRows.length * 12, 48), 216)

  console.log(`CSV Ticker: ${dataRows.length} data rows | ${headers.length} columns | Speed: ${scrollSpeed}s`)

  return (
    <div className="w-full">
      {/* Play/Pause Button */}
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-colors"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              <span className="text-sm font-medium">Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span className="text-sm font-medium">Play</span>
            </>
          )}
        </button>
      </div>

      {/* Scrolling CSV Content - Full Width with Manual Scroll Support */}
      <div className="relative overflow-y-auto h-64 scroll-smooth">
        {/* Top fade gradient */}
        <div className="absolute left-0 right-0 top-0 h-16 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none"></div>
        {/* Bottom fade gradient */}
        <div className="absolute left-0 right-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>

        <div className="py-4">
          <div
            className="flex flex-col animate-csv-scroll-vertical"
            style={{
              animation: `csv-scroll-vertical ${scrollSpeed}s linear infinite`,
              animationPlayState: isPlaying ? 'running' : 'paused'
            }}
          >
            {/* Duplicate content for seamless infinite loop */}
            {[...dataRows, ...dataRows].map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-4 my-3 shadow-sm"
              >
                {row.map((cell, cellIndex) => (
                  <div
                    key={cellIndex}
                    className="py-1.5 text-base"
                  >
                    <span className="font-bold text-blue-700">{headers[cellIndex]}:</span>{' '}
                    <span className="font-semibold text-gray-900">{cell || '-'}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes csv-scroll-vertical {
            0% {
              transform: translateY(0);
            }
            100% {
              transform: translateY(-50%);
            }
          }

          .animate-csv-scroll-vertical {
            animation-duration: ${scrollSpeed}s;
          }
        `}</style>
      </div>
    </div>
  )
}

export default CSVTicker
