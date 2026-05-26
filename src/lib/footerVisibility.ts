export function shouldShowFooter(pathname: string): boolean {
  return !/^\/student\/spaces\/[^/]+\//.test(pathname)
}
