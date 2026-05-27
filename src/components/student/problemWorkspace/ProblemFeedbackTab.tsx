import Card from '@/components/common/Card/Card'
import type { ProblemFeedbackItem } from '@/types/studentProblemWorkspace.type'

interface ProblemFeedbackTabProps {
  items: ProblemFeedbackItem[]
}

function ProblemFeedbackTab({ items }: ProblemFeedbackTabProps) {
  if (items.length === 0) {
    return (
      <p className="text-body2 text-gray-500 text-center py-12">
        아직 받은 피드백이 없습니다.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-4">
      {items.map((item) => (
        <li key={item.id}>
          <Card
            width="w-full"
            className="bg-black border-gray-800 flex flex-col gap-3 py-5"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-body2 text-neon-green font-medium">
                {item.authorName}
              </span>
              <time className="text-body3 text-gray-500">{item.createdAt}</time>
            </div>
            <p className="text-body2 text-gray-300 leading-relaxed">{item.message}</p>
            {item.codeSnippet && (
              <pre className="text-body3 text-gray-400 bg-gray-900 border-gray-800 rounded-lg border px-4 py-3 font-mono overflow-x-auto">
                {item.codeSnippet}
              </pre>
            )}
          </Card>
        </li>
      ))}
    </ul>
  )
}

export default ProblemFeedbackTab
