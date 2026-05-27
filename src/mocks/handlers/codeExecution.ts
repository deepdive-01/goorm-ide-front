import { http, HttpResponse } from 'msw'
import { mockCodeExecution } from '@/mocks/fixtures'

export const codeExecutionHandlers = [
  http.post('*/api/v1/code/execute', () =>
    HttpResponse.json(mockCodeExecution),
  ),
]
