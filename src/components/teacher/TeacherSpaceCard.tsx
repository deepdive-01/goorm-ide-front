import { FileText, Users } from 'lucide-react'
import Card from '@/components/common/Card/Card'
import { TEACHER_SPACES_COPY } from '@/content/teacherSpaces'
import type { WorkspaceListItem } from '@/types/workspace.type'

type TeacherSpaceCardProps = {
  workspace: WorkspaceListItem
}

function TeacherSpaceCard({ workspace }: TeacherSpaceCardProps) {
  const itemCount = workspace.problem_count ?? workspace.lecture_count ?? 0

  return (
    <Card
      width="w-full"
      className="h-full bg-[#0d0d0d] transition-colors hover:border-neon-green/60"
    >
      <div className="flex min-h-[12.5rem] flex-col justify-between gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-head3 text-white line-clamp-1">{workspace.name}</h2>
            <span className="text-body3 shrink-0 font-semibold text-white">
              {TEACHER_SPACES_COPY.problemCount(itemCount)}
            </span>
          </div>

          <p className="text-body2 text-gray-500 line-clamp-3 min-h-[3.75rem]">
            {workspace.description}
          </p>
        </div>

        <div className="text-body2 text-gray-500 flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-4 shrink-0" aria-hidden />
            {TEACHER_SPACES_COPY.memberCount(workspace.member_count)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FileText className="size-4 shrink-0" aria-hidden />
            {TEACHER_SPACES_COPY.lectureCount(itemCount)}
          </span>
        </div>
      </div>
    </Card>
  )
}

export default TeacherSpaceCard
