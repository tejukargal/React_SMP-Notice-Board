/**
 * Checks if a string contains HTML tags
 */
export const isHtmlContent = (content: string): boolean => {
  return /<[^>]+>/.test(content)
}

/**
 * Converts URLs in text to highlighted card-style links
 */
const linkifyUrls = (text: string, color: string = '#3B82F6', lightColor: string = '#EFF6FF'): string => {
  // Enhanced URL regex to match http, https, www, and common domain patterns
  const urlPattern = /(\b(?:https?:\/\/|www\.)[^\s<>"{}|\\^`\[\]]+)/gi

  return text.replace(urlPattern, (url) => {
    // Ensure the URL has a protocol
    const href = url.startsWith('http') ? url : `https://${url}`

    // Create a department badge-style link with inline styles for reliability
    // Mobile-optimized: uses calc to ensure it fits within container with proper margins
    return `<a href="${href}" target="_blank" rel="noopener noreferrer"
      style="text-decoration: none; display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.375rem 1rem; margin: 0.125rem; background: transparent; border: 2px solid ${color}; border-radius: 9999px; color: ${color}; font-weight: 700; font-size: 0.875rem; white-space: nowrap; max-width: min(280px, calc(100vw - 3rem)); overflow: hidden; text-overflow: ellipsis; transition: all 0.2s;">
      <svg style="width: 0.875rem; height: 0.875rem; flex-shrink: 0;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
export const sanitizeHtmlContent = (content: string, color?: string, lightColor?: string): string => {
  let sanitized = content

  if (!isHtmlContent(content)) {
    // Plain text - convert URLs to card-style links first, then newlines to <br> tags
    sanitized = linkifyUrls(content, color, lightColor)
    sanitized = sanitized.replace(/\n/g, '<br>')
    return sanitized
  }

  // For HTML content, linkify URLs first
  sanitized = linkifyUrls(sanitized, color, lightColor)

  // Remove script tags and other dangerous elements
  sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, '')
  sanitized = sanitized.replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
  sanitized = sanitized.replace(/on\w+="[^"]*"/gi, '') // Remove event handlers

  return sanitized
}

/**
 * Renders HTML content safely for display
 */
export const renderHtmlContent = (content: string, color?: string, lightColor?: string): { __html: string } => {
  return { __html: sanitizeHtmlContent(content, color, lightColor) }
}
