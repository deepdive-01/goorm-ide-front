import Card from '@/components/common/Card/Card'
import { STUDENT_PROBLEM_WORKSPACE_COPY } from '@/content/studentProblemWorkspace'
import type { ProblemCodeCommentItem } from '@/types/studentProblemWorkspace.type'

interface ProblemCodeCommentsTabProps {
  items: ProblemCodeCommentItem[]
}

function ProblemCodeCommentsTab({ items }: ProblemCodeCommentsTabProps) {
  if (items.length === 0) {
    return (
      <p className="text-body2 text-gray-500 text-center py-12">
        코드 코멘트가 없습니다.
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
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-body2 text-neon-green font-medium">
                  {item.authorName}
                </span>
                <span className="text-body3 text-gray-500">
                  {STUDENT_PROBLEM_WORKSPACE_COPY.review.lineLabel(item.lineNumber)}
                </span>
              </div>
              <time className="text-body3 text-gray-500">{item.createdAt}</time>
            </div>
            <p className="text-body2 text-gray-300 leading-relaxed">{item.message}</p>
          </Card>
        </li>
      ))}
    </ul>
  )
}

export default ProblemCodeCommentsTab
