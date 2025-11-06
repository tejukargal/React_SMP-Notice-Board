import { useEffect, useState } from 'react'

interface GreetingScreenProps {
  onComplete: () => void
}

const GreetingScreen = ({ onComplete }: GreetingScreenProps) => {
  const [show, setShow] = useState(true)
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    // Determine greeting based on time of day
    const hour = new Date().getHours()

    if (hour >= 5 && hour < 12) {
      setGreeting('Good Morning')
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good Afternoon')
    } else {
      setGreeting('Good Evening')
    }

    // Load cursive font
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    // Hide greeting after animation and notify parent
    const timer = setTimeout(() => {
      setShow(false)
      onComplete()
    }, 2000)

    return () => {
      clearTimeout(timer)
      if (document.head.contains(link)) {
        document.head.removeChild(link)
      }
    }
  }, [onComplete])

  if (!show) return null

  return (
    <div className="h-[45px] flex items-center justify-center px-3 sm:px-4 lg:px-6 overflow-hidden">
      <style>{`
        @keyframes zoomIn3D {
          0% {
            transform: scale(0) translateZ(-500px);
            opacity: 0;
          }
          40% {
            opacity: 1;
            transform: scale(1) translateZ(0);
          }
          60% {
            opacity: 1;
            transform: scale(1) translateZ(0);
          }
          100% {
            transform: scale(0) translateZ(-500px);
            opacity: 0;
          }
        }

        .greeting-text {
          animation: zoomIn3D 2s ease-in-out forwards;
          font-family: 'Great Vibes', cursive;
          font-size: 2.5rem;
          font-weight: 400;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
          perspective: 1000px;
          transform-style: preserve-3d;
          white-space: nowrap;
        }

        @media (max-width: 640px) {
          .greeting-text {
            font-size: 1.75rem;
          }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          .greeting-text {
            font-size: 2.25rem;
          }
        }
      `}</style>

      <h1 className="greeting-text">
        {greeting}
      </h1>
    </div>
  )
}

export default GreetingScreen
