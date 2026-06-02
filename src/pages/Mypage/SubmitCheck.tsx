import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronRight, FileCode, Folder } from 'lucide-react'
import Card from '@/components/common/Card/Card'
import Spinner from '@/components/common/Spinner/Spinner'
import Button from '@/components/common/Button/Button'
import { formatDateTime } from '@/utils/formatDateTime'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useProblemTitles } from '@/hooks/useProblemTitles'
import { useStudentSubmissions } from '@/hooks/useStudentSubmissions'
import type { SubmissionDetail } from '@/types/file.type'

interface ProblemInfo {
  title: string
  spaceId: number
  spaceName: string
}

interface WorkspaceGroup {
  spaceId: number
  spaceName: string
  submissions: SubmissionDetail[]
}

interface WorkspaceSectionProps {
  group: WorkspaceGroup
  titleMap: Record<number, ProblemInfo> | undefined
  onNavigate: (spaceId: number, problemId: number) => void
}

function WorkspaceSection({
  group,
  titleMap,
  onNavigate,
}: WorkspaceSectionProps) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="flex flex-col gap-3">
      <button
        className="flex items-center gap-2 text-left"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        <Folder size={16} />
        <span className="text-body2">{group.spaceName}</span>
        <span className="text-body3 text-gray-500">
          {group.submissions.length}
        </span>
      </button>

      {isOpen && (
        <div className="flex flex-col gap-3 pl-6">
          {group.submissions.map((submission) => (
            <Card key={submission.id} className="flex w-full justify-between">
              <div className="flex items-center gap-4">
                <FileCode size={18} />
                <div>
                  <div className="text-body1">
                    {titleMap?.[submission.problem_id]?.title ?? '-'}
                  </div>
                  <div className="text-body3 text-gray-600">
                    {formatDateTime(
                      submission.created_at === submission.updated_at
                        ? submission.created_at
                        : submission.updated_at,
                    )}
                  </div>
                </div>
              </div>

              <Button
                size="sm"
                children="제출 확인"
                bgColor="bg-transparent"
                textColor="text-neon-green"
                textClassName="text-body3"
                onClick={() => onNavigate(group.spaceId, submission.problem_id)}
              />
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function SubmitCheck() {
  const navigate = useNavigate()
  const { user } = useCurrentUser()
  const { data: submissions, isLoading: isSubmissionsLoading } =
    useStudentSubmissions(user?.id ?? 0)

  const problemIds = useMemo(
    () => [...new Set((submissions ?? []).map((s) => s.problem_id))],
    [submissions],
  )

  const { data: titleMap, isLoading: isTitlesLoading } =
    useProblemTitles(problemIds)

  const workspaceGroups = useMemo<WorkspaceGroup[]>(() => {
    const map = new Map<number, WorkspaceGroup>()

    for (const submission of submissions ?? []) {
      const info = titleMap?.[submission.problem_id]
      if (!info) continue

      if (!map.has(info.spaceId)) {
        map.set(info.spaceId, {
          spaceId: info.spaceId,
          spaceName: info.spaceName,
          submissions: [],
        })
      }
      map.get(info.spaceId)!.submissions.push(submission)
    }

    return [...map.values()]
  }, [submissions, titleMap])

  const handleNavigate = (spaceId: number, problemId: number) => {
    navigate(`/student/spaces/${spaceId}/problems/${problemId}`)
  }

  if (isSubmissionsLoading || isTitlesLoading) {
    return (
      <Card width="fit" className="flex h-fit flex-col gap-6">
        <div className="text-head3 text-light-background">제출 내역 조회</div>
        <Spinner />
      </Card>
    )
  }

  return (
    <Card width="fit" className="flex h-fit flex-col gap-6">
      <div className="text-head3 text-light-background">제출 내역 조회</div>

      {workspaceGroups.length === 0 ? (
        <div className="text-body2 flex h-30 items-center justify-center text-gray-500">
          제출 내역이 없습니다.
        </div>
      ) : (
        workspaceGroups.map((group) => (
          <WorkspaceSection
            key={group.spaceId}
            group={group}
            titleMap={titleMap}
            onNavigate={handleNavigate}
          />
        ))
      )}
    </Card>
  )
}

export default SubmitCheck
