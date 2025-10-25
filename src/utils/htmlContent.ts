/**
 * Checks if a string contains HTML tags
 */
export const isHtmlContent = (content: string): boolean => {
  return /<[^>]+>/.test(content)
}

/**
 * Sanitizes HTML content to ensure safe rendering
 * Removes potentially dangerous attributes and keeps only formatting
 */
export const sanitizeHtmlContent = (content: string): string => {
  if (!isHtmlContent(content)) {
    // Plain text - convert newlines to <br> tags
    return content.replace(/\n/g, '<br>')
  }

  // Remove script tags and other dangerous elements
  let sanitized = content.replace(/<script[^>]*>.*?<\/script>/gi, '')
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
