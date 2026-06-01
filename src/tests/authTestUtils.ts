export function createAxiosError(status: number, code: string) {
  return {
    isAxiosError: true,
    response: {
      status,
      data: {
        code,
      },
    },
  }
}
