/**
 * Checks if a string contains HTML tags
 */
export const isHtmlContent = (content: string): boolean => {
  return /<[^>]+>/.test(content)
}

/**
 * Converts URLs in text to highlighted card-style links
 */
const linkifyUrls = (text: string): string => {
  // Enhanced URL regex to match http, https, www, and common domain patterns
  const urlPattern = /(\b(?:https?:\/\/|www\.)[^\s<>"{}|\\^`\[\]]+)/gi

  return text.replace(urlPattern, (url) => {
    // Ensure the URL has a protocol
    const href = url.startsWith('http') ? url : `https://${url}`

    // Create a compact card-style link with inline styles for reliability
    // Mobile-optimized: uses calc to ensure it fits within container with proper margins
    return `<a href="${href}" target="_blank" rel="noopener noreferrer"
      class="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1.5 mx-0.5 my-0.5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-400 rounded-lg text-blue-700 font-semibold text-xs sm:text-sm hover:from-blue-100 hover:to-indigo-100 hover:border-blue-600 hover:shadow-md transition-all duration-200 no-underline"
      style="text-decoration: none; display: inline-flex; align-items: center; white-space: nowrap; max-width: min(280px, calc(100vw - 3rem)); overflow: hidden; text-overflow: ellipsis;">
      <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
      </svg>
      <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0;">${url.length > 35 ? url.substring(0, 35) + '...' : url}</span>
    </a>`
  })
}

/**
 * Sanitizes HTML content to ensure safe rendering
 * Removes potentially dangerous attributes and keeps only formatting
 */
export const sanitizeHtmlContent = (content: string): string => {
  let sanitized = content

  if (!isHtmlContent(content)) {
    // Plain text - convert URLs to card-style links first, then newlines to <br> tags
    sanitized = linkifyUrls(content)
    sanitized = sanitized.replace(/\n/g, '<br>')
    return sanitized
  }

  // For HTML content, linkify URLs first
  sanitized = linkifyUrls(sanitized)

  // Remove script tags and other dangerous elements
  sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, '')
  sanitized = sanitized.replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
  sanitized = sanitized.replace(/on\w+="[^"]*"/gi, '') // Remove event handlers

  return sanitized
}

/**
 * Renders HTML content safely for display
 */
export const renderHtmlContent = (content: string): { __html: string } => {
  return { __html: sanitizeHtmlContent(content) }
}
