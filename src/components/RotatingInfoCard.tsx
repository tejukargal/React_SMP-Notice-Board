import { useEffect, useState } from 'react'
import { departmentInfo, departments } from '../utils/departments'

const infoTexts = [
  'Stay updated with the latest circulars and announcements',
  'Important notices for all departments and students',
  'Check regularly for exam schedules and results',
  'Never miss important college updates and events',
  'Quick access to department-specific information',
  'Get instant notifications about fee dues and scholarships',
]

const RotatingInfoCard = () => {
  const [currentIndex, setCurrentIndex] = useState(-2) // Start with -2 to show SMP NOTICE BOARD first
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Rotate through departments for color cycling
  const currentDept = departments[Math.abs(currentIndex) % departments.length]
  const deptInfo = departmentInfo[currentDept]

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => {
          if (prev === -2) return -1 // After SMP NOTICE BOARD, show Date & Time
          if (prev === -1) return 0 // After Date & Time, go to first info text
          // After last info text, loop back to SMP NOTICE BOARD
          return (prev + 1) >= infoTexts.length ? -2 : prev + 1
        })
        setIsTransitioning(false)
      }, 500)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const formatDateTime = () => {
    return currentTime.toLocaleString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  return (
    <div>
      <style>{`
        @keyframes infoSlideOut {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-20px);
            opacity: 0;
          }
        }

        @keyframes infoSlideIn {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .info-exit {
          animation: infoSlideOut 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .info-enter {
          animation: infoSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .smp-board-title {
          font-size: 1.75rem !important; /* 28px - covers full card on mobile */
          font-weight: 800 !important;
          letter-spacing: 0.05em;
          line-height: 1.2;
          word-spacing: 0.15em;
        }

        /* Small mobile devices */
        @media (min-width: 375px) {
          .smp-board-title {
            font-size: 2rem !important; /* 32px */
          }
        }

        /* Large mobile / Small tablet */
        @media (min-width: 480px) {
          .smp-board-title {
            font-size: 2.25rem !important; /* 36px */
            white-space: nowrap;
          }
        }

        /* Tablet and Desktop */
        @media (min-width: 640px) {
          .smp-board-title {
            font-size: 2.75rem !important; /* 44px */
          }
        }

        .smp-datetime {
          font-size: 1rem !important; /* 16px - standalone display */
          font-weight: 600 !important;
          line-height: 1.5;
        }

        /* Small mobile devices */
        @media (min-width: 375px) {
          .smp-datetime {
            font-size: 1.125rem !important; /* 18px */
          }
        }

        /* Large mobile / Small tablet */
        @media (min-width: 480px) {
          .smp-datetime {
            font-size: 1.25rem !important; /* 20px */
          }
        }

        /* Tablet and Desktop */
        @media (min-width: 640px) {
          .smp-datetime {
            font-size: 1.5rem !important; /* 24px */
          }
        }
      `}</style>

      <div
        className={`${deptInfo.bgClass} border-l-4 ${deptInfo.borderClass} rounded-t-xl overflow-hidden transition-all duration-700`}
      >
        <div className="relative h-[100px] flex items-center justify-center px-4 sm:px-6">
          <div
            className={`w-full text-center ${
              isTransitioning ? 'info-exit' : 'info-enter'
            }`}
            key={currentIndex}
          >
            {currentIndex === -2 ? (
              <div className={`${deptInfo.textClass} smp-board-title`}>
                SMP NOTICE BOARD
              </div>
            ) : currentIndex === -1 ? (
              <div className={`${deptInfo.textClass} smp-datetime`}>
                {formatDateTime()}
              </div>
            ) : (
              <div className={`text-base sm:text-lg font-semibold ${deptInfo.textClass}`}>
                {infoTexts[currentIndex]}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RotatingInfoCard
