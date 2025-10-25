import { useState, useEffect } from 'react'
import { Circular } from '../types'

interface CircularTickerProps {
  circulars: Circular[]
}

const CircularTicker = ({ circulars }: CircularTickerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  // Array of progress bar colors to cycle through
  const progressColors = [
    'bg-yellow-400',
    'bg-green-400',
    'bg-pink-400',
    'bg-purple-400',
    'bg-orange-400',
    'bg-cyan-400',
  ]

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
  const currentColor = progressColors[currentIndex % progressColors.length]

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white overflow-hidden relative h-16 sm:h-20">
      <div
        className={`flex items-center justify-center px-4 h-full transition-opacity duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="text-center max-w-5xl">
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-1 sm:gap-3">
            <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-white/20 rounded-full text-xs font-semibold">
              {currentCircular.department}
            </span>
            <span className="hidden sm:inline text-sm">•</span>
            <span className="font-bold text-xs sm:text-lg line-clamp-1">{currentCircular.title}</span>
            <span className="hidden sm:inline text-sm">•</span>
            <span className="text-blue-100 text-xs sm:text-base line-clamp-1">{currentCircular.subject}</span>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div
          className={`h-full ${currentColor} transition-all`}
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
