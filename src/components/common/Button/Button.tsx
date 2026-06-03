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
  textClassName = 'text-body2',
  hoverClassName,
  size = 'lg',
  type = 'button',
  form,
  className = '',
  isLoading = false,
  disabled = false,
  ariaLabel,
  loadingIndicator,
  onClick,
}: ButtonProps) {
  const isDisabled = isLoading || disabled
  const interactiveStyles = isDisabled
    ? 'cursor-not-allowed opacity-50'
    : hoverClassName
      ? `cursor-pointer ${hoverClassName}`
      : 'cursor-pointer hover:brightness-95 active:brightness-90'

  return (
    <button
      type={type}
      form={form}
      aria-label={ariaLabel}
      aria-busy={isLoading}
      aria-disabled={isDisabled}
      disabled={isDisabled}
      className={`${textClassName} flex items-center justify-center gap-2 rounded-lg px-4 transition-colors duration-150 ${width} ${sizeStyles[size]} ${bgColor ?? ''} ${textColor ?? ''} ${interactiveStyles} ${className}`}
      onClick={onClick}
    >
      {isLoading && (loadingIndicator ?? <Spinner color={textColor} />)}
      {children}
    </button>
  )
}

export default Button
