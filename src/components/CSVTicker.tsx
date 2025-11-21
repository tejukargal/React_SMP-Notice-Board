import { useEffect, useState, useRef } from 'react'
import { Pause, Play } from 'lucide-react'
import { Department } from '../types'
import { departmentInfo } from '../utils/departments'

interface CSVTickerProps {
  csvBase64: string
  fileName: string
  department?: Department
}

const CSVTicker = ({ csvBase64, fileName: _fileName, department = 'All' }: CSVTickerProps) => {
  const [csvData, setCsvData] = useState<string[][]>([])
  const [error, setError] = useState<string>('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isManualScrolling, setIsManualScrolling] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<number | null>(null)

  const deptInfo = departmentInfo[department]

  // Handle manual scroll - pause auto-scroll temporarily
  const handleScroll = () => {
    if (isPlaying) {
      setIsManualScrolling(true)

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      // Resume auto-scroll after 3 seconds of no manual scrolling
      scrollTimeoutRef.current = window.setTimeout(() => {
        setIsManualScrolling(false)
      }, 3000)
    }
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

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
      {/* Scrolling CSV Content - Click to Play/Pause, scroll manually */}
      <div
        ref={scrollContainerRef}
        className="relative overflow-y-auto h-64 cursor-pointer select-none"
        onClick={() => setIsPlaying(!isPlaying)}
        onScroll={handleScroll}
        onWheel={handleScroll}
        title={isPlaying ? 'Click to pause (scroll to override)' : 'Click to play or scroll manually'}
      >
        {/* Top fade gradient */}
        <div className={`absolute left-0 right-0 top-0 h-16 bg-gradient-to-b ${deptInfo.bgClass.replace('bg-', 'from-')} to-transparent z-10 pointer-events-none`}></div>
        {/* Bottom fade gradient */}
        <div className={`absolute left-0 right-0 bottom-0 h-16 bg-gradient-to-t ${deptInfo.bgClass.replace('bg-', 'from-')} to-transparent z-10 pointer-events-none`}></div>

        {/* Play/Pause indicator overlay */}
        <div className="absolute top-2 right-2 z-20 pointer-events-none">
          <div className="bg-black/50 text-white rounded-full p-2">
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </div>
        </div>

        <div className="py-4">
          <div
            className="flex flex-col animate-csv-scroll-vertical"
            style={{
              animation: `csv-scroll-vertical ${scrollSpeed}s linear infinite`,
              animationPlayState: (isPlaying && !isManualScrolling) ? 'running' : 'paused'
            }}
          >
            {/* Duplicate content for seamless infinite loop */}
            {[...dataRows, ...dataRows].map((row, rowIndex) => (
              <div
                key={rowIndex}
                className={`flex flex-col ${deptInfo.bgClass} border-l-4 ${deptInfo.borderClass} rounded-xl p-4 my-2 shadow-md`}
              >
                {row.map((cell, cellIndex) => (
                  <div
                    key={cellIndex}
                    className="py-0.5 text-sm"
                  >
                    <span className={`font-bold ${deptInfo.textClass}`}>{headers[cellIndex]}:</span>{' '}
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
