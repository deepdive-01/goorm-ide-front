import { Save } from 'lucide-react'
import Button from '@/components/common/Button/Button'
import PageHeader from '@/components/common/PageHeader/PageHeader'
import { TEACHER_SUBMISSION_REVIEW_COPY } from '@/content/teacherSubmissionReview'

type TeacherSubmissionReviewSubHeaderProps = {
  spaceName: string
  studentNickname: string
  onBack: () => void
  onSave: () => void
  isSaving?: boolean
}

const SAVE_BTN = {
  size: 'md' as const,
  textClassName: 'text-body1 font-medium',
  className: 'h-9 shrink-0 gap-2 px-3 py-0',
  hoverClassName: 'hover:bg-[#8ef48c] active:brightness-95',
}

function TeacherSubmissionReviewSubHeader({
  spaceName,
  studentNickname,
  onBack,
  onSave,
  isSaving = false,
}: TeacherSubmissionReviewSubHeaderProps) {
  const copy = TEACHER_SUBMISSION_REVIEW_COPY

  return (
    <div className="border-gray-800 bg-[#0d0d0d] border-b">
      <div className="mx-auto flex w-full max-w-[1512px] items-center justify-between gap-6 px-4 py-5 sm:px-16 lg:px-22">
        <div className="flex min-w-0 items-center gap-6 sm:gap-8">
          <PageHeader onClick={onBack} className="shrink-0 text-white">
            {copy.backToSpace(spaceName)}
          </PageHeader>
          <div className="bg-gray-800 hidden h-6 w-px sm:block" aria-hidden />
          <h1 className="text-head3 text-white truncate">
            {copy.submissionTitle(studentNickname)}
          </h1>
        </div>

        <Button onClick={onSave} isLoading={isSaving} {...SAVE_BTN}>
          <Save className="size-4 shrink-0" aria-hidden />
          {copy.save}
        </Button>
      </div>
    </div>
  )
}

export default TeacherSubmissionReviewSubHeader
