import { useState, useEffect } from 'react'
import { Circular } from '../types'
import { departmentInfo, departments } from '../utils/departments'

interface CircularTickerProps {
  circulars: Circular[]
}

const CircularTicker = ({ circulars: _circulars }: CircularTickerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [rotation, setRotation] = useState(0)
  const [isRotating, setIsRotating] = useState(true) // Start with rotation enabled
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  // Only display Welcome, Date, and Time - loop these 3 items only
  const enhancedCirculars: Circular[] = []

  // Welcome to SMP
  const welcomeMessage: Circular = {
    id: 'welcome-message',
    title: 'Welcome To SMP',
    subject: '',
    department: 'Office',
    date: new Date().toISOString(),
    body: '',
    attachments: [],
    is_featured: false,
    created_at: new Date().toISOString(),
  }

  // Date display
  const dateDisplay: Circular = {
    id: 'date-display',
    title: formatDate(),
    subject: '',
    department: 'Office',
    date: new Date().toISOString(),
    body: '',
    attachments: [],
    is_featured: false,
    created_at: new Date().toISOString(),
  }

  // Time display
  const timeDisplay: Circular = {
    id: 'time-display',
    title: formatTime(),
    subject: '',
    department: 'Office',
    date: new Date().toISOString(),
    body: '',
    attachments: [],
    is_featured: false,
    created_at: new Date().toISOString(),
  }

  // Add items in order: Welcome, Date, Time (3-sided cube)
  enhancedCirculars.push(welcomeMessage)
  enhancedCirculars.push(dateDisplay)
  enhancedCirculars.push(timeDisplay)

  useEffect(() => {
    if (enhancedCirculars.length === 0) return

    const interval = setInterval(() => {
      setRotation((prev) => prev - 120) // 3-sided cube rotation (360/3 = 120 degrees)
      setCurrentIndex((prev) => (prev + 1) % enhancedCirculars.length)
    }, 15000) // Show each circular for 15 seconds

    return () => clearInterval(interval)
  }, [enhancedCirculars.length])

  // Trigger rotation animation whenever rotation changes
  useEffect(() => {
    setIsRotating(true)
    const timer = setTimeout(() => {
      setIsRotating(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [rotation])

  if (enhancedCirculars.length === 0) return null

  return (
    <div
      className="overflow-hidden relative h-16 sm:h-20 shadow-md"
      style={{
        fontFamily: "'Josefin Sans', 'Noto Sans Kannada', sans-serif",
        perspective: '1000px'
      }}
    >
      <div
        className="relative h-full"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotation}deg)`,
          transition: isRotating ? 'transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)' : 'none',
          willChange: 'transform',
        }}
      >
        {enhancedCirculars.map((circular, index) => {
          const nextDept = departments[Math.abs(index) % departments.length]
          const nextDeptInfo = departmentInfo[nextDept]

          return (
            <div
              key={circular.id}
              className={`${nextDeptInfo.bgClass} absolute inset-0 flex items-center justify-center px-4`}
              style={{
                backfaceVisibility: 'hidden',
                transform: `rotateX(${120 * index}deg) translateZ(2.5rem)`,
                WebkitBackfaceVisibility: 'hidden',
                WebkitFontSmoothing: 'antialiased',
              }}
            >
              <div className="text-center max-w-5xl w-full px-2 sm:px-4">
                {/* Mobile layout */}
                <div className={`sm:hidden font-bold text-2xl leading-tight line-clamp-2 ${nextDeptInfo.textClass}`}>
                  {circular.title}
                </div>

                {/* Desktop layout */}
                <div className={`hidden sm:block font-bold text-3xl line-clamp-1 ${nextDeptInfo.textClass}`}>
                  {circular.title}
                </div>
              </div>

              {/* Progress indicator - only show on current face */}
              {index === currentIndex && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
                  <div
                    key={`progress-${currentIndex}`}
                    className={`h-full w-full ${nextDeptInfo.textClass} bg-current`}
                    style={{
                      transformOrigin: 'center',
                      animation: 'progressExpand 15s linear',
                    }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Keyframe animation */}
      <style>{`
        @keyframes progressExpand {
          0% {
            transform: scaleX(0);
          }
          100% {
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  )
}

export default CircularTicker
