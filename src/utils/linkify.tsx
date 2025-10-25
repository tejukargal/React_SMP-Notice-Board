// Utility to convert URLs in text to clickable links
export const linkifyText = (text: string): JSX.Element[] => {
  // URL regex pattern
  const urlPattern = /(https?:\/\/[^\s]+)/g

  const parts = text.split(urlPattern)

  return parts.map((part, index) => {
    if (part.match(urlPattern)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline font-medium break-all"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      )
    }
    return <span key={index}>{part}</span>
  })
}

// Component to render linkified text with whitespace preservation
interface LinkifiedTextProps {
  text: string
  className?: string
}

export const LinkifiedText = ({ text, className = '' }: LinkifiedTextProps) => {
  const lines = text.split('\n')

  return (
    <div className={className}>
      {lines.map((line, lineIndex) => (
        <span key={lineIndex}>
          {linkifyText(line)}
          {lineIndex < lines.length - 1 && <br />}
        </span>
      ))}
    </div>
  )
}
