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
          font-family: Impact, 'Arial Black', 'Helvetica Neue', Arial, sans-serif !important;
          font-size: 1.5rem !important; /* 24px - Mobile */
          font-weight: 900 !important;
          letter-spacing: 0.025em;
          line-height: 1.2;
          text-transform: uppercase;
          white-space: nowrap !important;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Tablet */
        @media (min-width: 768px) {
          .smp-board-title {
            font-size: 2.25rem !important; /* 36px */
          }
        }

        /* Desktop */
        @media (min-width: 1024px) {
          .smp-board-title {
            font-size: 3rem !important; /* 48px */
          }
        }

        .smp-datetime {
          font-family: Impact, 'Arial Black', 'Helvetica Neue', Arial, sans-serif !important;
          font-size: 0.875rem !important; /* 14px - Mobile */
          font-weight: 700 !important;
          line-height: 1.3;
          white-space: nowrap !important;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Tablet */
        @media (min-width: 768px) {
          .smp-datetime {
            font-size: 1.125rem !important; /* 18px */
          }
        }

        /* Desktop */
        @media (min-width: 1024px) {
          .smp-datetime {
            font-size: 1.375rem !important; /* 22px */
          }
        }
      `}</style>

      <div
        className={`${deptInfo.bgClass} border-l-4 ${deptInfo.borderClass} rounded-t-xl overflow-hidden transition-all duration-700`}
      >
        <div className="relative h-[100px] flex items-center justify-center px-3 sm:px-4 lg:px-6 overflow-hidden">
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
