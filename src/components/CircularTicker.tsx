import { Circular } from '../types'

interface CircularTickerProps {
  circulars: Circular[]
}

const CircularTicker = ({ circulars }: CircularTickerProps) => {
  if (circulars.length === 0) return null

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-blue-600 to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-indigo-600 to-transparent z-10"></div>

      <div className="flex animate-scroll whitespace-nowrap">
        {/* Duplicate the content for seamless loop */}
        {[...circulars, ...circulars].map((circular, index) => (
          <div
            key={`${circular.id}-${index}`}
            className="inline-flex items-center mx-8"
          >
            <span className="font-semibold">{circular.title}</span>
            <span className="mx-2">•</span>
            <span className="text-blue-100">{circular.subject}</span>
            <span className="mx-2">•</span>
            <span
              className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold"
            >
              {circular.department}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 25s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}

export default CircularTicker
