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

  // Add developer credit randomly in the circulars
  const enhancedCirculars = [...circulars]
  if (circulars.length > 0) {
    const developerCredit: Circular = {
      id: 'developer-credit',
      title: 'Developed by Tejaraj R, SMP',
      subject: 'Full Stack Developer',
      department: 'Office',
      date: new Date().toISOString(),
      body: '',
      attachments: [],
      is_featured: false,
      created_at: new Date().toISOString(),
    }
    // Insert at random position (every 3-5 circulars)
    const insertPosition = Math.floor(circulars.length / 2) || circulars.length
    enhancedCirculars.splice(insertPosition, 0, developerCredit)
  }

  useEffect(() => {
    if (enhancedCirculars.length === 0) return

    const interval = setInterval(() => {
      // Fade out
      setIsVisible(false)

      // After fade out, change content and fade in
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % enhancedCirculars.length)
        setIsVisible(true)
      }, 500) // Wait for fade out to complete
    }, 4000) // Show each circular for 4 seconds

    return () => clearInterval(interval)
  }, [enhancedCirculars.length])

  if (enhancedCirculars.length === 0) return null

  const currentCircular = enhancedCirculars[currentIndex]
  const currentColor = progressColors[currentIndex % progressColors.length]

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white overflow-hidden relative h-16 sm:h-20">
      <div
        className={`flex items-center justify-center px-4 h-full transition-opacity duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="text-center max-w-5xl w-full">
          {/* Mobile layout: 2 lines */}
          <div className="sm:hidden flex flex-col items-center justify-center gap-0.5">
            {/* Line 1: Department + Title */}
            <div className="flex items-center justify-center gap-2">
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-semibold flex-shrink-0">
                {currentCircular.department}
              </span>
              <span className="font-bold text-xs line-clamp-1">{currentCircular.title}</span>
            </div>
            {/* Line 2: Subject */}
            <div className="text-blue-100 text-xs line-clamp-1 px-4">
              {currentCircular.subject}
            </div>
          </div>

          {/* Desktop layout: Single line */}
          <div className="hidden sm:flex sm:flex-wrap items-center justify-center gap-3">
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
              {currentCircular.department}
            </span>
            <span className="text-sm">•</span>
            <span className="font-bold text-lg line-clamp-1">{currentCircular.title}</span>
            <span className="text-sm">•</span>
            <span className="text-blue-100 text-base line-clamp-1">{currentCircular.subject}</span>
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
