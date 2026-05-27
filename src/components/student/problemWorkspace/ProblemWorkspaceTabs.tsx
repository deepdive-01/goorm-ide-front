import type { ProblemWorkspaceTab } from '@/types/studentProblemWorkspace.type'

interface TabConfig {
  id: ProblemWorkspaceTab
  label: string
  count?: number
}

interface ProblemWorkspaceTabsProps {
  tabs: TabConfig[]
  activeTab: ProblemWorkspaceTab
  onChange: (tab: ProblemWorkspaceTab) => void
}

function ProblemWorkspaceTabs({
  tabs,
  activeTab,
  onChange,
}: ProblemWorkspaceTabsProps) {
  return (
    <div
      className="border-gray-800 bg-gray-900 inline-flex w-fit max-w-full shrink-0 rounded-sm border"
      role="tablist"
      aria-label="문제 패널 탭"
    >
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`text-body3 flex items-center justify-center gap-1 px-5 py-2 whitespace-nowrap transition-colors ${
              index > 0 ? 'border-gray-800 border-l' : ''
            } ${isActive ? 'bg-background text-neon-green' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => onChange(tab.id)}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className="text-body3 opacity-60">{tab.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default ProblemWorkspaceTabs
