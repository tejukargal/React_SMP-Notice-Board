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

      // Limit to first 50 rows for performance
      setCsvData(parsedData.slice(0, 50))
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

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg overflow-hidden my-4">
      <div className="bg-green-600 text-white px-4 py-2 flex items-center justify-between">
        <span className="font-semibold text-sm">📊 CSV Data Preview: {fileName}</span>
        <span className="text-xs bg-green-700 px-2 py-1 rounded">{dataRows.length} rows</span>
      </div>

      <div className="relative overflow-hidden py-3">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-green-50 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-emerald-50 to-transparent z-10"></div>

        <div className="flex animate-csv-scroll whitespace-nowrap">
          {/* Duplicate content for seamless loop */}
          {[...dataRows, ...dataRows].map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="inline-flex items-center gap-2 mx-6 bg-white border border-green-200 rounded-lg px-4 py-2 shadow-sm"
            >
              {row.map((cell, cellIndex) => (
                <div key={cellIndex} className="inline-flex items-center">
                  <span className="text-xs font-semibold text-green-700 mr-1">
                    {headers[cellIndex] || `Col ${cellIndex + 1}`}:
                  </span>
                  <span className="text-sm text-gray-700 font-medium">
                    {cell || '-'}
                  </span>
                  {cellIndex < row.length - 1 && (
                    <span className="mx-3 text-green-300">|</span>
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
            animation: csv-scroll 45s linear infinite;
          }

          .animate-csv-scroll:hover {
            animation-play-state: paused;
          }
        `}</style>
      </div>

      <div className="bg-green-100 px-4 py-2 text-xs text-green-700">
        💡 Hover to pause scrolling • Showing first {Math.min(50, dataRows.length)} rows
      </div>
    </div>
  )
}

export default CSVTicker
