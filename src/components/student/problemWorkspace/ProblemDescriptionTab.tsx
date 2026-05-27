import ProblemDetailView from '@/components/problem/ProblemDetailView'
import type { ProblemDetail } from '@/types/problem.type'

interface ProblemDescriptionTabProps {
  problem: ProblemDetail
}

function ProblemDescriptionTab({ problem }: ProblemDescriptionTabProps) {
  return <ProblemDetailView problem={problem} />
}

export default ProblemDescriptionTab
