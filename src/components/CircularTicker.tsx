import { useState, useEffect } from 'react'
import { Circular } from '../types'
import { departmentInfo, departments } from '../utils/departments'

interface CircularTickerProps {
  circulars: Circular[]
}

const CircularTicker = ({ circulars }: CircularTickerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  // Rotate through departments for color cycling (same as RotatingInfoCard)
  const currentDept = departments[Math.abs(currentIndex) % departments.length]
  const deptInfo = departmentInfo[currentDept]

  // Load Impact font for consistency with RotatingInfoCard
  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.cdnfonts.com/css/impact'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [])

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

  return (
    <div className={`${deptInfo.bgClass} border-l-4 ${deptInfo.borderClass} overflow-hidden relative h-16 sm:h-20 transition-all duration-700`}
      style={{
        fontFamily: "'Impact', 'Arial Black', 'Helvetica Neue', Arial, sans-serif"
      }}
    >
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
              <span className={`px-2 py-0.5 ${deptInfo.textClass} bg-white/30 rounded-full text-xs font-bold flex-shrink-0`}>
                {currentCircular.department}
              </span>
              <span className={`font-extrabold text-xs line-clamp-1 ${deptInfo.textClass}`}>{currentCircular.title}</span>
            </div>
            {/* Line 2: Subject */}
            <div className={`${deptInfo.textClass} opacity-80 text-xs line-clamp-1 px-4 font-semibold`}>
              {currentCircular.subject}
            </div>
          </div>

          {/* Desktop layout: Single line */}
          <div className="hidden sm:flex sm:flex-wrap items-center justify-center gap-3">
            <span className={`px-3 py-1 ${deptInfo.textClass} bg-white/30 rounded-full text-xs font-bold`}>
              {currentCircular.department}
            </span>
            <span className={`text-sm ${deptInfo.textClass} font-bold`}>•</span>
            <span className={`font-extrabold text-lg line-clamp-1 ${deptInfo.textClass}`}>{currentCircular.title}</span>
            <span className={`text-sm ${deptInfo.textClass} font-bold`}>•</span>
            <span className={`${deptInfo.textClass} opacity-80 text-base line-clamp-1 font-semibold`}>{currentCircular.subject}</span>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
        <div
          className={`h-full ${deptInfo.textClass} bg-current transition-all`}
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
