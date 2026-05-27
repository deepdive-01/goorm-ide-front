const INLINE_CODE_PATTERN = /(`[^`]+`)/g

function ProblemDescriptionBody({ description }: { description: string }) {
  const parts = description.split(INLINE_CODE_PATTERN)

  return (
    <p className="text-body2 text-gray-400 leading-relaxed">
      {parts.map((part, index) => {
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={index}
              className="text-neon-green bg-neon-green/10 font-mono font-medium rounded px-1"
            >
              {part.slice(1, -1)}
            </code>
          )
        }

        return <span key={index}>{part}</span>
      })}
    </p>
  )
}

export default ProblemDescriptionBody
