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
  const [currentIndex, setCurrentIndex] = useState(-1) // Start with -1 to show header first
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
          if (prev === -1) return 0 // After header, go to first info text
          return (prev + 1) % (infoTexts.length + 1) === 0 ? -1 : (prev + 1) % (infoTexts.length + 1) // Loop back to header
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
          white-space: nowrap;
        }

        /* Scale down on very small screens if needed */
        @media (max-width: 400px) {
          .smp-board-title {
            font-size: 1.5rem !important;
          }
        }
      `}</style>

      <div
        className={`${deptInfo.bgClass} border-l-4 ${deptInfo.borderClass} rounded-t-xl overflow-hidden transition-all duration-700`}
      >
        <div className="relative h-[110px] sm:h-[100px] flex items-center justify-center px-6">
          <div
            className={`w-full text-center ${
              isTransitioning ? 'info-exit' : 'info-enter'
            }`}
            key={currentIndex}
          >
            {currentIndex === -1 ? (
              <div className="space-y-2">
                <div className={`text-3xl sm:text-4xl font-extrabold ${deptInfo.textClass} tracking-wide smp-board-title`}>
                  SMP NOTICE BOARD
                </div>
                <div className={`text-sm sm:text-base font-medium ${deptInfo.textClass} opacity-90`}>
                  {formatDateTime()}
                </div>
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
