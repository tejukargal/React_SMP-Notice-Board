import { useEffect, useRef } from 'react'
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered } from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const RichTextEditor = ({ value, onChange, placeholder = 'Enter text...' }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const isInitializedRef = useRef(false)

  // Initialize content
  useEffect(() => {
    if (editorRef.current && !isInitializedRef.current) {
      // Clean up value - convert plain text to HTML if needed
      const cleanValue = value || ''
      editorRef.current.innerHTML = cleanValue
      isInitializedRef.current = true
    }
  }, [value])

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML
      // Remove any style attributes that might cause issues
      const cleanContent = content.replace(/style="[^"]*"/gi, (match) => {
        // Keep only valid styles
        const validStyles = ['text-align', 'font-weight', 'font-style', 'text-decoration']
        const styles = match.match(/style="([^"]*)"/)?.[1] || ''
        const cleanedStyles = styles.split(';')
          .filter(s => validStyles.some(valid => s.trim().startsWith(valid)))
          .join(';')
        return cleanedStyles ? `style="${cleanedStyles}"` : ''
      })
      onChange(cleanContent)
    }
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    handleInput()
  }

  const ToolbarButton = ({
    icon: Icon,
    command,
    value,
    title
  }: {
    icon: any
    command: string
    value?: string
    title: string
  }) => (
    <button
      type="button"
      onClick={() => execCommand(command, value)}
      className="p-2 hover:bg-gray-200 rounded transition"
      title={title}
    >
      <Icon className="w-4 h-4 text-gray-700" />
    </button>
  )

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 px-2 py-1.5 flex gap-1 flex-wrap">
        <ToolbarButton icon={Bold} command="bold" title="Bold (Ctrl+B)" />
        <ToolbarButton icon={Italic} command="italic" title="Italic (Ctrl+I)" />
        <ToolbarButton icon={Underline} command="underline" title="Underline (Ctrl+U)" />

        <div className="w-px bg-gray-300 mx-1"></div>

        <ToolbarButton icon={List} command="insertUnorderedList" title="Bullet List" />
        <ToolbarButton icon={ListOrdered} command="insertOrderedList" title="Numbered List" />

        <div className="w-px bg-gray-300 mx-1"></div>

        <ToolbarButton icon={AlignLeft} command="justifyLeft" title="Align Left" />
        <ToolbarButton icon={AlignCenter} command="justifyCenter" title="Align Center" />
        <ToolbarButton icon={AlignRight} command="justifyRight" title="Align Right" />
        <ToolbarButton icon={AlignJustify} command="justifyFull" title="Justify" />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="w-full px-4 py-3 min-h-[150px] outline-none focus:outline-none"
        style={{ whiteSpace: 'pre-wrap' }}
        data-placeholder={placeholder}
      />

      <style>{`
        [contentEditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          position: absolute;
        }

        [contentEditable] ul,
        [contentEditable] ol {
          margin-left: 1.5rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }

        [contentEditable] ul {
          list-style-type: disc;
        }

        [contentEditable] ol {
          list-style-type: decimal;
        }

        [contentEditable] li {
          margin-bottom: 0.25rem;
        }
      `}</style>
    </div>
  )
}

export default RichTextEditor
