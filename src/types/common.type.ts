export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl'

export interface SpinnerProps {
  size?: SpinnerSize
  color?: string // Tailwind text 클래스 (기본: currentColor 상속)
}

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

export interface ButtonProps {
  children?: React.ReactNode
  width?: string // Tailwind width 클래스 사용 가능: 'w-20' | 'w-full' | 'w-auto' 등
  bgColor?: string
  textColor?: string
  size?: ButtonSize
  isLoading?: boolean
  disabled?: boolean
  ariaLabel?: string
  loadingIndicator?: React.ReactNode // 커스텀 로딩 UI 슬롯 (기본: 스피너)
  onClick?: () => void | Promise<void>
}

export type CardCursor = 'default' | 'pointer'

export interface CardProps {
  children?: React.ReactNode
  width?: string // Tailwind width 클래스 사용 가능: 'w-20' | 'w-full' | 'w-auto' 등
  cursor?: CardCursor
  onClick?: () => void
}

export type BadgeSize = 'sm' | 'md' | 'lg'
export type BadgeShape = 'circle' | 'square'

export interface BadgeProps {
  children?: React.ReactNode // 텍스트 또는 아이콘 컴포넌트
  size?: BadgeSize
  shape?: BadgeShape
  bgColor?: string // Tailwind bg 클래스 (기본: bg-neon-green)
  bgOpacity?: number // 배경색 투명도 0~100 (기본: 100)
  textColor?: string // Tailwind text 클래스 (기본: text-black)
  ariaLabel: string // 접근성 필수값
}
