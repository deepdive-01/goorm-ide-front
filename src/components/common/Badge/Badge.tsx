import type { BadgeProps, BadgeSize, BadgeShape } from '@/types/common.type'

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'w-10 h-10 text-body1',
  md: 'w-12 h-12 text-body1',
  lg: 'w-[90px] h-[90px] text-head3',
}

const shapeStyles: Record<BadgeShape, string> = {
  circle: 'rounded-full',
  square: 'rounded-lg',
}

function Badge({
  children,
  size = 'md',
  shape = 'circle',
  bgColor = 'bg-neon-green',
  bgOpacity,
  textColor = 'text-black',
  ariaLabel,
}: BadgeProps) {
  const clampedOpacity =
    bgOpacity !== undefined
      ? Math.min(100, Math.max(0, bgOpacity)) / 100
      : undefined

  return (
    <span
      aria-label={ariaLabel}
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden ${sizeStyles[size]} ${shapeStyles[shape]} ${textColor}`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-0 ${bgColor}`}
        style={
          clampedOpacity !== undefined ? { opacity: clampedOpacity } : undefined
        }
      />
      <span className="relative">{children}</span>
    </span>
  )
}

export default Badge
