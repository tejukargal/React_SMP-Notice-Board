import { useState, useEffect } from 'react'
import { Circular } from '../types'

interface CircularTickerProps {
  circulars: Circular[]
}

const CircularTicker = ({ circulars }: CircularTickerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (circulars.length === 0) return

    const interval = setInterval(() => {
      // Fade out
      setIsVisible(false)

      // After fade out, change content and fade in
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % circulars.length)
        setIsVisible(true)
      }, 500) // Wait for fade out to complete
    }, 4000) // Show each circular for 4 seconds

    return () => clearInterval(interval)
  }, [circulars.length])

  if (circulars.length === 0) return null

  const currentCircular = circulars[currentIndex]

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 overflow-hidden relative">
      <div
        className={`flex items-center justify-center px-4 transition-opacity duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="text-center max-w-5xl">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <span className="font-bold text-base sm:text-lg">{currentCircular.title}</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-blue-100 text-sm sm:text-base">{currentCircular.subject}</span>
            <span className="hidden sm:inline">•</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
              {currentCircular.department}
            </span>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
        <div
          className="h-full bg-white transition-all"
          style={{
            width: isVisible ? '100%' : '0%',
            transition: isVisible ? 'width 4s linear' : 'width 0.5s linear',
          }}
        />
      </div>
    </div>
  )
}

export default CircularTicker
