import { http, HttpResponse } from 'msw'
import { authHandlers } from './auth'
import { userHandlers } from './user'
import { workspaceHandlers } from './workspace'
import { problemBankHandlers } from './problemBank'
import { problemHandlers } from './problem'
import { notificationHandlers } from './notification'
import { feedbackHandlers } from './feedback'
import { timerHandlers } from './timer'
import { submissionHandlers } from './submission'
import { fileHandlers } from './file'
import { codeExecutionHandlers } from './codeExecution'

export const handlers = [
  http.get('*/test', () => HttpResponse.json({ message: 'success' })),
  ...authHandlers,
  ...userHandlers,
  ...workspaceHandlers,
  ...problemBankHandlers,
  ...problemHandlers,
  ...notificationHandlers,
  ...feedbackHandlers,
  ...timerHandlers,
  ...submissionHandlers,
  ...fileHandlers,
  ...codeExecutionHandlers,
]
