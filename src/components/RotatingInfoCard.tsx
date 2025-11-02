import { useEffect, useState } from 'react'
import { departmentInfo, departments } from '../utils/departments'
import { useCirculars } from '../context/CircularsContext'
import { Department } from '../types'

interface RotatingInfoCardProps {
  onDepartmentChange?: (department: Department | null) => void
}

const RotatingInfoCard = ({ onDepartmentChange }: RotatingInfoCardProps) => {
  const { circulars } = useCirculars()
  const [currentIndex, setCurrentIndex] = useState(-2) // Start with -2 to show SMP NOTICE BOARD first
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [availableDepartments, setAvailableDepartments] = useState<Department[]>([])

  // Load Impact font for all devices
  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.cdnfonts.com/css/impact'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [])

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Get available departments from circulars
  useEffect(() => {
    if (circulars.length > 0) {
      const uniqueCategories = Array.from(new Set(circulars.map(c => c.department)))
      const categoriesWithoutAll = uniqueCategories.filter(cat => cat !== 'All')
      setAvailableDepartments(categoriesWithoutAll as Department[])
    }
  }, [circulars])

  // Rotate through departments for color cycling
  const currentDept = departments[Math.abs(currentIndex) % departments.length]
  const deptInfo = departmentInfo[currentDept]

  useEffect(() => {
    // Determine duration based on current index
    // SMP NOTICE BOARD (-2) stays for 8 seconds, others stay for 4 seconds
    const duration = currentIndex === -2 ? 8000 : 4000

    const timeout = setTimeout(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => {
          if (prev === -2) return -1 // After SMP NOTICE BOARD, show Date & Time
          if (prev === -1) return 0 // After Date & Time, show "Available Circulars"
          // After "Available Circulars", loop through departments
          const deptCount = availableDepartments.length
          if (deptCount === 0) return -2 // No departments, loop back to SMP NOTICE BOARD
          // Department indices start from 1
          if (prev >= 0 && prev < deptCount) return prev + 1
          // After last department, show info text
          if (prev === deptCount) return deptCount + 1
          // After info text, loop back to SMP NOTICE BOARD
          return -2
        })
        setIsTransitioning(false)
      }, 500)
    }, duration)

    return () => clearTimeout(timeout)
  }, [currentIndex, availableDepartments])

  // Notify parent component when current department changes
  useEffect(() => {
    if (currentIndex > 0 && currentIndex <= availableDepartments.length) {
      const currentDepartment = availableDepartments[currentIndex - 1]
      onDepartmentChange?.(currentDepartment)
    } else {
      onDepartmentChange?.(null)
    }
  }, [currentIndex, availableDepartments, onDepartmentChange])

  const formatDate = () => {
    return currentTime.toLocaleString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = () => {
    return currentTime.toLocaleString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  return (
    <div>
      <style>{`
        @keyframes infoRollOut {
          0% {
            transform: translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateX(-100%);
            opacity: 0;
          }
        }

        @keyframes infoRollIn {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .info-exit {
          animation: infoRollOut 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .info-enter {
          animation: infoRollIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .smp-board-title {
          font-family: 'Impact', 'Arial Black', 'Helvetica Neue', Arial, sans-serif !important;
          font-size: 1.875rem !important; /* 30px - Mobile (balanced size) */
          font-weight: 900 !important;
          letter-spacing: 0.025em;
          line-height: 1.2;
          text-transform: uppercase;
          white-space: nowrap !important;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
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
          font-size: 1rem !important; /* 16px - Mobile (increased from 14px) */
          font-weight: 700 !important;
          line-height: 1.3;
        }

        .smp-datetime > div {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        /* Tablet */
        @media (min-width: 768px) {
          .smp-datetime {
            font-size: 1.25rem !important; /* 20px (increased from 18px) */
          }
        }

        /* Desktop */
        @media (min-width: 1024px) {
          .smp-datetime {
            font-size: 1.5rem !important; /* 24px (increased from 22px) */
          }
        }

        .principal-name {
          font-family: 'Josefin Sans', 'Noto Sans Kannada', sans-serif !important;
          font-size: 1.25rem !important; /* 20px - Mobile */
          font-weight: 700 !important;
          line-height: 1.3;
        }

        /* Tablet */
        @media (min-width: 768px) {
          .principal-name {
            font-size: 1.5rem !important; /* 24px */
          }
        }

        /* Desktop */
        @media (min-width: 1024px) {
          .principal-name {
            font-size: 1.75rem !important; /* 28px */
          }
        }

        .available-circulars-text {
          font-family: 'Josefin Sans', 'Noto Sans Kannada', sans-serif !important;
          font-size: 1.25rem !important; /* 20px - Mobile */
          font-weight: 700 !important;
          line-height: 1.3;
        }

        /* Tablet */
        @media (min-width: 768px) {
          .available-circulars-text {
            font-size: 1.5rem !important; /* 24px */
          }
        }

        /* Desktop */
        @media (min-width: 1024px) {
          .available-circulars-text {
            font-size: 1.75rem !important; /* 28px */
          }
        }

        .department-label {
          font-family: 'Josefin Sans', 'Noto Sans Kannada', sans-serif !important;
          font-size: 1.75rem !important; /* 28px - Mobile - Large size */
          font-weight: 800 !important;
          line-height: 1.2;
        }

        /* Tablet */
        @media (min-width: 768px) {
          .department-label {
            font-size: 2.25rem !important; /* 36px */
          }
        }

        /* Desktop */
        @media (min-width: 1024px) {
          .department-label {
            font-size: 2.75rem !important; /* 44px */
          }
        }

        .info-message {
          font-family: 'Josefin Sans', 'Noto Sans Kannada', sans-serif !important;
          font-size: 1.125rem !important; /* 18px - Mobile */
          font-weight: 600 !important;
          line-height: 1.4;
        }

        /* Tablet */
        @media (min-width: 768px) {
          .info-message {
            font-size: 1.25rem !important; /* 20px */
          }
        }

        /* Desktop */
        @media (min-width: 1024px) {
          .info-message {
            font-size: 1.5rem !important; /* 24px */
          }
        }
      `}</style>

      <div
        className={`${deptInfo.bgClass} border-l-4 ${deptInfo.borderClass} rounded-t-xl overflow-hidden transition-all duration-700`}
      >
        <div className="relative h-[55px] sm:h-[60px] flex items-center justify-center px-3 sm:px-4 lg:px-6 overflow-hidden">
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
              <div className={`${deptInfo.textClass} smp-datetime flex flex-col items-center justify-center gap-1`}>
                <div>{formatDate()}</div>
                <div>{formatTime()}</div>
              </div>
            ) : currentIndex === 0 ? (
              <div className={`${deptInfo.textClass} available-circulars-text`}>
                Available Circulars
              </div>
            ) : currentIndex > 0 && currentIndex <= availableDepartments.length ? (
              <div className={`${deptInfo.textClass} department-label`}>
                {availableDepartments[currentIndex - 1]}
              </div>
            ) : (
              <div className={`${deptInfo.textClass} info-message`}>
                Stay updated with the latest circulars and announcements
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RotatingInfoCard
