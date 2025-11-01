import { useState, useEffect } from 'react'
import { Circular } from '../types'
import { departmentInfo, departments } from '../utils/departments'

interface CircularTickerProps {
  circulars: Circular[]
}

const CircularTicker = ({ circulars }: CircularTickerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isRotating, setIsRotating] = useState(false)

  // Add welcome messages, principal and developer credits in the circulars
  const enhancedCirculars = [...circulars]
  if (circulars.length > 0) {
    // Welcome message 1
    const welcomeMessage1: Circular = {
      id: 'welcome-message-1',
      title: 'Welcome To SMP Notice Board',
      subject: '',
      department: 'Office',
      date: new Date().toISOString(),
      body: '',
      attachments: [],
      is_featured: false,
      created_at: new Date().toISOString(),
    }

    // Welcome message 2
    const welcomeMessage2: Circular = {
      id: 'welcome-message-2',
      title: 'Visit Daily For Latest Circulars, Memos & Announcements',
      subject: '',
      department: 'Office',
      date: new Date().toISOString(),
      body: '',
      attachments: [],
      is_featured: false,
      created_at: new Date().toISOString(),
    }

    // Principal credit - shown first
    const principalCredit: Circular = {
      id: 'principal-credit',
      title: 'Principal: Sri Vidyadhara C A',
      subject: '',
      department: 'Office',
      date: new Date().toISOString(),
      body: '',
      attachments: [],
      is_featured: false,
      created_at: new Date().toISOString(),
    }

    // Developer credit
    const developerCredit: Circular = {
      id: 'developer-credit',
      title: 'Developed by Thejaraj R, SMP',
      subject: '',
      department: 'Office',
      date: new Date().toISOString(),
      body: '',
      attachments: [],
      is_featured: false,
      created_at: new Date().toISOString(),
    }

    // Insert welcome messages at the beginning
    enhancedCirculars.unshift(welcomeMessage2)
    enhancedCirculars.unshift(welcomeMessage1)

    // Insert principal credit after welcome messages
    enhancedCirculars.splice(2, 0, principalCredit)

    // Insert developer credit at middle position
    const insertPosition = Math.floor(enhancedCirculars.length / 2) || enhancedCirculars.length
    enhancedCirculars.splice(insertPosition, 0, developerCredit)
  }

  useEffect(() => {
    if (enhancedCirculars.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % enhancedCirculars.length)
    }, 4000) // Show each circular for 4 seconds

    return () => clearInterval(interval)
  }, [enhancedCirculars.length])

  // Trigger rotation animation whenever currentIndex changes
  useEffect(() => {
    setIsRotating(true)
    const timer = setTimeout(() => {
      setIsRotating(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [currentIndex])

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
          transform: `rotateX(${-90 * currentIndex}deg)`,
          transition: isRotating ? 'transform 0.6s ease-in-out' : 'none',
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
                transform: `rotateX(${90 * index}deg) translateZ(2.5rem)`,
              }}
            >
              <div className="text-center max-w-5xl w-full">
                {/* Mobile layout: 2 lines */}
                <div className="sm:hidden flex flex-col items-center justify-center gap-1">
                  {/* Line 1: Title */}
                  <div className={`font-bold text-sm line-clamp-1 px-4 ${nextDeptInfo.textClass}`}>
                    {circular.title}
                  </div>
                  {/* Line 2: Subject */}
                  <div className={`${nextDeptInfo.textClass} opacity-90 text-sm line-clamp-1 px-4`}>
                    {circular.subject}
                  </div>
                </div>

                {/* Desktop layout: Single line */}
                <div className="hidden sm:flex sm:flex-wrap items-center justify-center gap-3">
                  <span className={`font-bold text-xl line-clamp-1 ${nextDeptInfo.textClass}`}>{circular.title}</span>
                  <span className={`text-base ${nextDeptInfo.textClass}`}>•</span>
                  <span className={`${nextDeptInfo.textClass} opacity-90 text-lg line-clamp-1`}>{circular.subject}</span>
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
                      animation: 'progressExpand 4s linear',
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
