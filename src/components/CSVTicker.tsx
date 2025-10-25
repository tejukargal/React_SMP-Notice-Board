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

  // Calculate dynamic speed based on row count (MUCH faster)
  const baseSpeed = Math.max(12, dataRows.length * 0.08) // 0.08s per row, minimum 12s
  const mobileSpeed = Math.max(8, dataRows.length * 0.06) // 0.06s per row, minimum 8s

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg overflow-hidden my-4">
      <div className="bg-green-600 text-white px-4 py-2 flex items-center justify-between">
        <span className="font-semibold text-sm">📊 CSV Data Preview: {fileName}</span>
        <span className="text-xs bg-green-700 px-2 py-1 rounded">{dataRows.length} rows</span>
      </div>

      <div className="relative overflow-hidden py-2">
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-green-50 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-emerald-50 to-transparent z-10"></div>

        <div className="flex animate-csv-scroll whitespace-nowrap" style={{
          animation: `csv-scroll ${baseSpeed}s linear infinite`
        }}>
          {/* Duplicate content for seamless loop */}
          {[...dataRows, ...dataRows].map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="inline-flex items-center gap-1.5 mx-3 bg-white border border-green-300 rounded px-3 py-1.5 shadow-sm text-xs"
            >
              {row.map((cell, cellIndex) => (
                <div key={cellIndex} className="inline-flex items-center">
                  <span className="font-bold text-green-700 mr-1">
                    {headers[cellIndex] || `Col${cellIndex + 1}`}:
                  </span>
                  <span className="text-gray-800 font-medium">
                    {cell || '-'}
                  </span>
                  {cellIndex < row.length - 1 && (
                    <span className="mx-2 text-green-400">•</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <style>{`
          @keyframes csv-scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          .animate-csv-scroll {
            animation-duration: ${baseSpeed}s;
          }

          /* Even faster on mobile */
          @media (max-width: 768px) {
            .animate-csv-scroll {
              animation-duration: ${mobileSpeed}s !important;
            }
          }

          .animate-csv-scroll:hover {
            animation-play-state: paused;
          }
        `}</style>
      </div>

      <div className="bg-green-100 px-4 py-2 text-xs text-green-700">
        💡 Hover/tap to pause • Showing all {dataRows.length} rows • Speed: {baseSpeed}s desktop / {mobileSpeed}s mobile
      </div>
    </div>
  )
}

export default CSVTicker
