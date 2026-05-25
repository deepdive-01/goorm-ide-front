import {
  Brain,
  Code2,
  Database,
  FileText,
  Globe,
  Terminal,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from '@/components/common/Card/Card'
import type { WorkspaceListItem } from '@/types/workspace.type'
import { STUDENT_SPACES_COPY } from '@/content/studentSpaces'

const CARD_ICONS: LucideIcon[] = [Code2, Brain, Globe, Database, Terminal]

type SpaceCardProps = {
  workspace: WorkspaceListItem
  onClick?: () => void
}

function SpaceCard({ workspace, onClick }: SpaceCardProps) {
  const navigate = useNavigate()
  const Icon = CARD_ICONS[(workspace.id - 1) % CARD_ICONS.length] ?? Code2
  const problemCount = workspace.problem_count ?? 0
  const lectureCount = workspace.lecture_count ?? problemCount

  const handleClick = () => {
    if (onClick) {
      onClick()
      return
    }
    navigate(`/student/spaces/${workspace.id}/problems`)
  }

  return (
    <Card width="w-full" cursor="pointer" onClick={handleClick}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="border-gray-800 bg-gray-900 flex size-10 shrink-0 items-center justify-center rounded-lg border">
            <Icon className="text-neon-green size-5" aria-hidden />
          </div>
          {problemCount > 0 && (
            <span className="text-body3 text-gray-400 border-gray-800 shrink-0 rounded-md border px-2 py-1">
              {STUDENT_SPACES_COPY.problemCount(problemCount)}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5 text-left">
          <h2 className="text-head3 text-white line-clamp-1">{workspace.name}</h2>
          {workspace.mentor_name && (
            <p className="text-body3 text-gray-500">{workspace.mentor_name}</p>
          )}
          <p className="text-body2 text-gray-500 line-clamp-3 min-h-[3.75rem]">
            {workspace.description}
          </p>
        </div>

        <div className="text-body3 text-gray-500 flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-4 shrink-0" aria-hidden />
            {STUDENT_SPACES_COPY.memberCount(workspace.member_count)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FileText className="size-4 shrink-0" aria-hidden />
            {STUDENT_SPACES_COPY.lectureCount(lectureCount)}
          </span>
        </div>
      </div>
    </Card>
  )
}

export default SpaceCard
