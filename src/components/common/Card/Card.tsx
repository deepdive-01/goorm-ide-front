import type { CardCursor, CardProps } from '@/types/common.type'

const cursorStyles: Record<CardCursor, string> = {
  default: 'cursor-default',
  pointer: 'cursor-pointer',
}

function Card({
  children,
  width = 'w-fit',
  cursor = 'default',
  onClick,
}: CardProps) {
  return (
    <div
      className={`text-body1 bg-background text-light-background rounded-xl border border-gray-800 px-7 py-6 ${width} ${cursorStyles[cursor]}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default Card
