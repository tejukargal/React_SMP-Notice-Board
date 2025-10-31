import { Share2 } from 'lucide-react'

const Footer = () => {
  const appUrl = 'https://smp-notice-board.netlify.app/'

  const handleShare = async () => {
    const shareData = {
      title: 'SMP Notice Board',
      text: 'Check out the SMP Notice Board for latest circulars, memos & announcements!',
      url: appUrl,
    }

    try {
      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(appUrl)
        alert('App link copied to clipboard!')
      }
    } catch (error) {
      // If sharing was cancelled or failed, try copying to clipboard
      if (error instanceof Error && error.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(appUrl)
          alert('App link copied to clipboard!')
        } catch (clipboardError) {
          console.error('Error sharing:', clipboardError)
        }
      }
    }
  }

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="text-center space-y-2">
          {/* Share Link - Pill shaped like department badge */}
          <div>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-full text-sm font-semibold border-2 border-blue-600 transition-all group"
            >
              <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Share this app link to Friends</span>
            </button>
          </div>

          {/* Copyright */}
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Sanjay Memorial Polytechnic, Sagar
          </p>
          <p className="text-gray-500 text-xs">
            All rights reserved
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
