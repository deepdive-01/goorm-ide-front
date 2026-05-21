import { useLocation } from 'react-router-dom'
import { PAGE_TITLES } from '@/constants/pageTitle'

export function usePageTitle(): string {
  const { pathname } = useLocation()
  return PAGE_TITLES[pathname] ?? ''
}
