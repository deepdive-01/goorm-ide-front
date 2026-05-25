import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
}

function Pagination({ currentPage, totalPages, onPrev, onNext }: PaginationProps) {
  return (
    <div className="text-body3 flex items-center justify-center gap-4 py-3 text-gray-600">
      <button
        onClick={onPrev}
        disabled={currentPage === 0}
        className="disabled:opacity-30"
      >
        <ChevronLeft size={16} />
      </button>
      <span>
        {currentPage + 1} / {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={currentPage === totalPages - 1}
        className="disabled:opacity-30"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}

export default Pagination
