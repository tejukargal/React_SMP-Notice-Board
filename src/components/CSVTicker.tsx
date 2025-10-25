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

  // Dynamic speed based on row count - ensures ALL rows are visible
  // Formula: 0.2s per row for desktop, 0.12s per row for mobile
  const desktopSpeed = Math.max(15, dataRows.length * 0.2)
  const mobileSpeed = Math.max(10, dataRows.length * 0.12)

  console.log(`CSV Ticker: ${dataRows.length} data rows | Desktop: ${desktopSpeed}s | Mobile: ${mobileSpeed}s`)

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg overflow-hidden my-4">
      <div className="bg-green-600 text-white px-4 py-2 flex items-center justify-between">
        <span className="font-semibold text-sm">📊 CSV Data: {fileName}</span>
        <span className="text-xs bg-green-700 px-2 py-1 rounded">{dataRows.length} rows</span>
      </div>

      <div className="relative overflow-hidden py-3">
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-green-50 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-emerald-50 to-transparent z-10"></div>

        <div
          className="flex gap-3 animate-csv-scroll whitespace-nowrap"
          style={{
            animation: `csv-scroll ${desktopSpeed}s linear infinite`
          }}
        >
          {/* Duplicate content for seamless infinite loop */}
          {[...dataRows, ...dataRows].map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="inline-flex flex-col bg-white border-2 border-green-400 rounded-lg px-3 py-2 shadow-md min-w-[280px]"
            >
              <div className="flex items-center justify-between mb-1.5 border-b border-green-200 pb-1">
                <span className="text-xs font-bold text-green-700">
                  Row {(rowIndex % dataRows.length) + 1}
                </span>
                <span className="text-xs text-gray-500">
                  of {dataRows.length}
                </span>
              </div>
              <div className="space-y-1">
                {row.map((cell, cellIndex) => (
                  <div key={cellIndex} className="flex items-start text-xs">
                    <span className="font-bold text-green-700 min-w-[80px]">
                      {headers[cellIndex]}:
                    </span>
                    <span className="text-gray-900 font-semibold flex-1">
                      {cell || '-'}
                    </span>
                  </div>
                ))}
              </div>
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
            animation-duration: ${desktopSpeed}s;
          }

          /* Faster on mobile */
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

      <div className="bg-green-100 px-4 py-2 text-xs text-green-700 flex items-center justify-between">
        <span>💡 Hover/tap to pause scrolling</span>
        <span className="font-semibold">All {dataRows.length} rows • {desktopSpeed}s desktop / {mobileSpeed}s mobile</span>
      </div>
    </div>
  )
}

export default CSVTicker
