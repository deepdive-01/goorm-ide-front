import { StudentCodeCommentsList } from '@/components/feedback'
import type { StudentCodeCommentItem } from '@/types/codeFeedback.type'
import type { Language } from '@/types/editor.type'

interface ProblemCodeCommentsTabProps {
  items: StudentCodeCommentItem[]
  code: string
  language: Language
}

function ProblemCodeCommentsTab({ items, code, language }: ProblemCodeCommentsTabProps) {
  return <StudentCodeCommentsList items={items} code={code} language={language} />
}

export default ProblemCodeCommentsTab
