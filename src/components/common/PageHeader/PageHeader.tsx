import type { PageHeaderProps } from '@/types/common.type'
import { usePageTitle } from '@/hooks/usePageTitle'
import { ArrowLeft } from 'lucide-react'

function PageHeader({ children, onClick, className = '' }: PageHeaderProps) {
  const routeTitle = usePageTitle()
  const title = children ?? routeTitle

  return (
    <div
      className={`text-light-background text-body1 flex items-center gap-3 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') onClick()
            }
          : undefined
      }
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <ArrowLeft />
      {title}
    </div>
  )
}

export default PageHeader
