import type { ButtonProps, ButtonSize } from '@/types/common.type'
import Spinner from '../Spinner/Spinner'

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'py-1',
  md: 'py-1.5',
  lg: 'py-2',
  xl: 'py-3',
}

function Button({
  children,
  width = 'w-fit',
  bgColor = 'bg-neon-green',
  textColor = 'text-black',
  size = 'lg',
  isLoading = false,
  disabled = false,
  ariaLabel,
  loadingIndicator,
  onClick,
}: ButtonProps) {
  const isDisabled = isLoading || disabled

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-busy={isLoading}
      aria-disabled={isDisabled}
      disabled={isDisabled}
      className={`text-body1 flex items-center justify-center gap-2 rounded-lg px-4 transition-opacity ${width} ${sizeStyles[size]} ${bgColor ?? ''} ${textColor ?? ''} ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
      onClick={onClick}
    >
      {isLoading && (loadingIndicator ?? <Spinner color={textColor} />)}
      {children}
    </button>
  )
}

export default Button
