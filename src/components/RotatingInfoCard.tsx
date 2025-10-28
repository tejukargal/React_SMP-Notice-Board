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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Rotate through departments for color cycling
  const currentDept = departments[currentIndex % departments.length]
  const deptInfo = departmentInfo[currentDept]

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % infoTexts.length)
        setIsTransitioning(false)
      }, 500)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

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
      `}</style>

      <div
        className={`${deptInfo.bgClass} border-l-4 ${deptInfo.borderClass} rounded-t-xl overflow-hidden transition-all duration-700`}
      >
        <div className="relative h-[90px] sm:h-[80px] flex items-center justify-center px-6">
          <div
            className={`text-base sm:text-lg font-semibold ${deptInfo.textClass} text-center ${
              isTransitioning ? 'info-exit' : 'info-enter'
            }`}
            key={currentIndex}
          >
            {infoTexts[currentIndex]}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RotatingInfoCard
