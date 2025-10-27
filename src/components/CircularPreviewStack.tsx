import { useEffect, useState } from 'react'
import { Circular } from '../types'
import { departmentInfo } from '../utils/departments'

interface CircularPreviewStackProps {
  circulars: Circular[]
}

const CircularPreviewStack = ({ circulars }: CircularPreviewStackProps) => {
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
      }, 600)
    }, 4500)

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
    <div className="relative">
      <style>{`
        @keyframes textSlideOut {
          0% {
            transform: translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateX(-30px);
            opacity: 0;
          }
        }

        @keyframes textSlideIn {
          0% {
            transform: translateX(30px);
            opacity: 0;
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
            transform: translateX(-8px);
            opacity: 0.3;
          }
        }

        @keyframes stackSlideIn {
          0% {
            transform: translateX(8px);
            opacity: 0.3;
          }
          100% {
            transform: translateX(0);
            opacity: 0.5;
          }
        }

        .text-exit {
          animation: textSlideOut 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .text-enter {
          animation: textSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .stack-text-exit {
          animation: stackSlideLeft 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .stack-text-enter {
          animation: stackSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>

      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-[180px] sm:h-[160px]">
          {/* Background/Stacked text layer */}
          {previewCirculars.length > 1 && (
            <div className="absolute inset-0 p-4 sm:p-5">
              <div
                className={`text-sm text-justify leading-relaxed line-clamp-5 sm:line-clamp-4 ${nextDeptInfo.textClass} opacity-40 ${
                  isTransitioning ? 'stack-text-exit' : 'stack-text-enter'
                }`}
                style={{
                  transform: 'translateX(8px)',
                  filter: 'blur(0.5px)',
                }}
                key={`stack-${nextCircular.id}`}
              >
                {stripHtml(nextCircular.body)}
              </div>
            </div>
          )}

          {/* Main text layer */}
          <div className="absolute inset-0 p-4 sm:p-5 bg-gradient-to-br from-white/95 to-white/90">
            <div
              className={`text-sm text-justify ${currentDeptInfo.textClass} leading-relaxed line-clamp-5 sm:line-clamp-4 ${
                isTransitioning ? 'text-exit' : 'text-enter'
              }`}
              key={`main-${currentCircular.id}`}
            >
              {stripHtml(currentCircular.body)}
            </div>
          </div>
        </div>

        {/* Department and Date info at bottom */}
        <div className="px-4 sm:px-5 pb-3 pt-2 bg-white/80 backdrop-blur-sm border-t border-gray-200">
          <div className="flex items-center justify-between text-xs">
            <span className={`${currentDeptInfo.textClass} font-semibold`}>
              {currentCircular.department}
            </span>
            <span className="text-gray-500">
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
              onClick={() => {
                setIsTransitioning(true)
                setTimeout(() => {
                  setCurrentIndex(index)
                  setIsTransitioning(false)
                }, 600)
              }}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-6 bg-blue-600'
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
