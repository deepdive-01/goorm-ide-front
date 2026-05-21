import type { PageHeaderProps } from '@/types/common.type'
import { usePageTitle } from '@/hooks/usePageTitle'
import { ArrowLeft } from 'lucide-react'

function PageHeader({ children, onClick }: PageHeaderProps) {
  const routeTitle = usePageTitle()
  const title = children ?? routeTitle

  return (
    <div
      className="text-light-background text-body1 flex items-center gap-3"
      onClick={onClick}
    >
      <ArrowLeft />
      {title}
    </div>
  )
}

export default PageHeader
