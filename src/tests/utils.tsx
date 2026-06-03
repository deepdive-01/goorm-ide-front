import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  AxiosHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { MemoryRouter } from 'react-router-dom'
import type { ReactElement } from 'react'
import type { ApiResponse } from '@/types/api.type'

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}

interface RenderWithRouterOptions {
  route?: string
}

export const renderWithRouter = (
  ui: ReactElement,
  { route = '/' }: RenderWithRouterOptions = {},
) => {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </QueryClientProvider>,
  )
}

export function createAxiosResponse<T>(
  response: ApiResponse<T>,
): AxiosResponse<ApiResponse<T>> {
  return {
    data: response,
    status: response.status,
    statusText: 'OK',
    headers: {},
    config: {
      headers: new AxiosHeaders(),
    } as InternalAxiosRequestConfig,
  }
}
