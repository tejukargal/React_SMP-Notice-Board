import { useEffect, useState } from 'react'
import { departmentInfo, departments } from '../utils/departments'

const RotatingInfoCard = () => {
  const [currentDeptIndex, setCurrentDeptIndex] = useState(0)

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

  // Rotate through departments for color cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDeptIndex((prev) => (prev + 1) % departments.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const currentDept = departments[currentDeptIndex]
  const deptInfo = departmentInfo[currentDept]


  return (
    <div>
      <style>{`
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
      `}</style>

      <div
        className={`${deptInfo.bgClass} border-l-4 ${deptInfo.borderClass} rounded-t-xl overflow-hidden transition-all duration-700`}
      >
        <div className="relative h-[55px] sm:h-[60px] flex items-center justify-center px-3 sm:px-4 lg:px-6 overflow-hidden">
          <div className={`${deptInfo.textClass} smp-board-title`}>
            SMP CONNECT
          </div>
        </div>
      </div>
    </div>
  )
}

export default RotatingInfoCard
