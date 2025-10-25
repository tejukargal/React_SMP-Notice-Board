import { useEffect, useState } from 'react'

interface CSVTickerProps {
  csvBase64: string
  fileName: string
}

const CSVTicker = ({ csvBase64, fileName }: CSVTickerProps) => {
  const [csvData, setCsvData] = useState<string[][]>([])
  const [error, setError] = useState<string>('')

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

  // Dynamic scrolling speed for easy readability - 10 seconds per row
  // Minimum 40 seconds, maximum 180 seconds
  const scrollSpeed = Math.min(Math.max(dataRows.length * 10, 40), 180)

  console.log(`CSV Ticker: ${dataRows.length} data rows | ${headers.length} columns | Speed: ${scrollSpeed}s`)

  return (
    <div className="w-full">
      {/* Scrolling CSV Content - Full Width */}
      <div className="relative overflow-hidden h-64">
        {/* Top fade gradient */}
        <div className="absolute left-0 right-0 top-0 h-16 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none"></div>
        {/* Bottom fade gradient */}
        <div className="absolute left-0 right-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>

        <div className="h-full py-4">
          <div
            className="flex flex-col animate-csv-scroll-vertical"
            style={{
              animation: `csv-scroll-vertical ${scrollSpeed}s linear infinite`
            }}
          >
            {/* Duplicate content for seamless infinite loop */}
            {[...dataRows, ...dataRows].map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="flex flex-col bg-gray-50 border border-gray-200 rounded-lg p-3 my-3"
              >
                {row.map((cell, cellIndex) => (
                  <div
                    key={cellIndex}
                    className="py-1 text-sm"
                  >
                    <span className="font-semibold text-gray-600">{headers[cellIndex]}:</span>{' '}
                    <span className="text-gray-900">{cell || '-'}</span>
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

          .animate-csv-scroll-vertical:hover {
            animation-play-state: paused;
          }
        `}</style>
      </div>

      <div className="text-xs text-gray-400 mt-1 text-center">
        📊 {fileName} • {dataRows.length} rows • Hover to pause
      </div>
    </div>
  )
}

export default CSVTicker
