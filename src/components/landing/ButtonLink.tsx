import type { ComponentPropsWithoutRef } from 'react'
import { Link } from 'react-router-dom'
import {
  BUTTON_BASE_CLASS,
  BUTTON_PRIMARY_CLASS,
  BUTTON_SECONDARY_CLASS,
} from '@/components/landing/buttonStyles'

type ButtonVariant = 'primary' | 'secondary'

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: BUTTON_PRIMARY_CLASS,
  secondary: BUTTON_SECONDARY_CLASS,
}

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: ButtonVariant
}

function getClassName(variant: ButtonVariant, className?: string) {
  return `${BUTTON_BASE_CLASS} ${VARIANT_CLASS[variant]} ${className ?? ''}`
}

export function ButtonLink({
  variant = 'primary',
  className,
  ...props
}: ButtonLinkProps) {
  return <Link className={getClassName(variant, className)} {...props} />
}
