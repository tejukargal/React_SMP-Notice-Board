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
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          {/* Share Link */}
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm mb-4 transition-colors group"
          >
            <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="underline decoration-dotted underline-offset-4">
              Share this app link to Friends
            </span>
          </button>

          {/* Copyright */}
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Sanjay Memorial Polytechnic, Sagar
          </p>
          <p className="text-gray-500 text-xs mt-1">
            All rights reserved
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
