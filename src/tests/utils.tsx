import { render } from '@testing-library/react'
import {
  AxiosHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { MemoryRouter } from 'react-router-dom'
import type { ReactElement } from 'react'
import type { ApiResponse } from '@/types/api.type'

interface RenderWithRouterOptions {
  route?: string
}

export const renderWithRouter = (
  ui: ReactElement,
  { route = '/' }: RenderWithRouterOptions = {},
) =>
  render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>)

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
