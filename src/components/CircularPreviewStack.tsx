import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Circular } from '../types'
import { departmentInfo } from '../utils/departments'

interface CircularPreviewStackProps {
  circulars: Circular[]
}

const CircularPreviewStack = ({ circulars }: CircularPreviewStackProps) => {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Filter out featured circular and get up to 10 circulars
  const previewCirculars = circulars.filter(c => !c.is_featured).slice(0, 10)

  useEffect(() => {
    if (previewCirculars.length <= 1) return

    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % previewCirculars.length)
        setIsTransitioning(false)
      }, 400)
    }, 3000)

    return () => clearInterval(interval)
  }, [previewCirculars.length])

  if (previewCirculars.length === 0) return null

  const currentCircular = previewCirculars[currentIndex]
  const nextCircular = previewCirculars[(currentIndex + 1) % previewCirculars.length]

  const currentDeptInfo = departmentInfo[currentCircular.department]
  const nextDeptInfo = departmentInfo[nextCircular.department]

  // Strip HTML tags from body for plain text preview
  const stripHtml = (html: string) => {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  return (
    <div className="relative" style={{ fontFamily: "'Josefin Sans', 'Noto Sans Kannada', sans-serif" }}>
      <style>{`
        @keyframes textSlideOut {
          0% {
            transform: translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateX(-50px);
            opacity: 0;
          }
        }

        @keyframes textSlideInElastic {
          0% {
            transform: translateX(80px);
            opacity: 0;
          }
          50% {
            transform: translateX(-2px);
            opacity: 0.8;
          }
          75% {
            transform: translateX(1px);
            opacity: 0.95;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes stackSlideLeft {
          0% {
            transform: translateX(0);
            opacity: 0.5;
          }
          100% {
            transform: translateX(-12px);
            opacity: 0.3;
          }
        }

        @keyframes stackSlideInElastic {
          0% {
            transform: translateX(80px);
            opacity: 0.2;
          }
          50% {
            transform: translateX(6px);
            opacity: 0.35;
          }
          75% {
            transform: translateX(9px);
            opacity: 0.42;
          }
          100% {
            transform: translateX(8px);
            opacity: 0.5;
          }
        }

        .text-exit {
          animation: textSlideOut 0.4s cubic-bezier(0.4, 0, 1, 1) forwards;
        }

        .text-enter {
          animation: textSlideInElastic 0.5s cubic-bezier(0.68, -0.25, 0.27, 1.25) forwards;
        }

        .stack-text-exit {
          animation: stackSlideLeft 0.4s cubic-bezier(0.4, 0, 1, 1) forwards;
        }

        .stack-text-enter {
          animation: stackSlideInElastic 0.5s cubic-bezier(0.68, -0.25, 0.27, 1.25) forwards;
        }
      `}</style>

      <div
        onClick={() => navigate('/circulars')}
        className={`relative ${currentDeptInfo.bgClass} border-l-4 ${currentDeptInfo.borderClass} rounded-lg shadow-lg overflow-hidden transition-all duration-700 cursor-pointer hover:shadow-xl`}
      >
        <div className="relative h-[160px] sm:h-[120px]">
          {/* Background/Stacked text layer */}
          {previewCirculars.length > 1 && (
            <div className="absolute inset-0 p-4 sm:p-5">
              {/* Subject for next circular */}
              <div
                className={`text-xs font-bold mb-1 ${nextDeptInfo.textClass} opacity-40 ${
                  isTransitioning ? 'stack-text-exit' : 'stack-text-enter'
                }`}
                style={{
                  transform: 'translateX(8px)',
                  filter: 'blur(0.5px)',
                }}
                key={`stack-subject-${nextCircular.id}`}
              >
                {nextCircular.subject}
              </div>
              <div
                className={`text-sm text-justify leading-relaxed line-clamp-4 sm:line-clamp-[2.5] ${nextDeptInfo.textClass} opacity-40 ${
                  isTransitioning ? 'stack-text-exit' : 'stack-text-enter'
                }`}
                style={{
                  transform: 'translateX(8px)',
                  filter: 'blur(0.5px)',
                }}
                key={`stack-body-${nextCircular.id}`}
              >
                {stripHtml(nextCircular.body)}
              </div>
            </div>
          )}

          {/* Main text layer */}
          <div className="absolute inset-0 p-4 sm:p-5 bg-gradient-to-br from-white/95 to-white/90">
            {/* Subject */}
            <div
              className={`text-xs font-bold mb-1 ${currentDeptInfo.textClass} ${
                isTransitioning ? 'text-exit' : 'text-enter'
              }`}
              key={`main-subject-${currentCircular.id}`}
            >
              {currentCircular.subject}
            </div>
            {/* Body */}
            <div
              className={`text-sm text-justify ${currentDeptInfo.textClass} leading-relaxed line-clamp-4 sm:line-clamp-[2.5] ${
                isTransitioning ? 'text-exit' : 'text-enter'
              }`}
              key={`main-body-${currentCircular.id}`}
            >
              {stripHtml(currentCircular.body)}
            </div>
          </div>
        </div>

        {/* Department and Date info at bottom */}
        <div className={`px-4 sm:px-5 pb-3 pt-2 ${currentDeptInfo.bgClass} border-t ${currentDeptInfo.borderClass} transition-all duration-700`}>
          <div className="flex items-center justify-between text-xs">
            <span className={`${currentDeptInfo.textClass} font-semibold`}>
              {currentCircular.department}
            </span>
            <span className={`${currentDeptInfo.textClass} opacity-80`}>
              {new Date(currentCircular.date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Pagination Dots */}
      {previewCirculars.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {previewCirculars.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation()
                setIsTransitioning(true)
                setTimeout(() => {
                  setCurrentIndex(index)
                  setIsTransitioning(false)
                }, 400)
              }}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex
                  ? `w-6 ${currentDeptInfo.textClass} bg-current`
                  : 'w-1.5 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to circular ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CircularPreviewStack
