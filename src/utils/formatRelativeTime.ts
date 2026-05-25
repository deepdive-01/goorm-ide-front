export function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString()
}

export function formatRelativeTime(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime()
  const diffHours = diffMs / (1000 * 60 * 60)

  if (diffHours < 1) return '방금전'
  if (diffHours < 24) return `${Math.floor(diffHours)}시간전`
  return `${Math.floor(diffHours / 24)}일전`
}
