import PageHeader from '@/components/common/PageHeader/PageHeader'
import type { Language } from '@/types/api.type'

interface ProblemWorkspaceSubHeaderProps {
  problemTitle: string
  spaceName: string
  language: Language
  onBack: () => void
  backLabel: string
}

function ProblemWorkspaceSubHeader({
  problemTitle,
  spaceName,
  language,
  onBack,
  backLabel,
}: ProblemWorkspaceSubHeaderProps) {
  return (
    <div className="border-gray-800 bg-black border-b">
      <div className="mx-auto flex w-full max-w-[1512px] items-center justify-between gap-6 px-4 py-4 sm:px-16 lg:px-22">
        <div className="flex min-w-0 items-center gap-6">
          <PageHeader onClick={onBack} className="shrink-0">
            {backLabel}
          </PageHeader>
          <div className="bg-gray-800 hidden h-6 w-px sm:block" aria-hidden />
          <div className="min-w-0">
            <h1 className="text-head3 text-white truncate">{problemTitle}</h1>
            <p className="text-body2 text-gray-400 mt-1 tracking-wide">
              {spaceName}
            </p>
          </div>
        </div>
        <span className="text-body4 text-neon-green border-gray-800 shrink-0 border px-2 py-1 tracking-wider uppercase">
          {language}
        </span>
      </div>
    </div>
  )
}

export default ProblemWorkspaceSubHeader
