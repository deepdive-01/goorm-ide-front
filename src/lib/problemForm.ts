import axios from 'axios'
import { TEACHER_CREATE_PROBLEM_COPY } from '@/content/teacherCreateProblem'
import type { Language } from '@/types/api.type'
import type { CreateTestcase } from '@/types/problem.type'

export interface CreateProblemFormValues {
  title: string
  language: Language | ''
  description: string
  testcases: CreateTestcase[]
}

function readApiResponseCode(error: unknown): string | null {
  if (!axios.isAxiosError(error) || !error.response) {
    return null
  }

  const data = error.response.data
  if (typeof data === 'object' && data !== null && 'code' in data && typeof data.code === 'string') {
    return data.code
  }

  return null
}

export function validateCreateProblemForm(values: CreateProblemFormValues): string | null {
  if (!values.title.trim()) {
    return TEACHER_CREATE_PROBLEM_COPY.titleRequired
  }

  if (!values.language) {
    return TEACHER_CREATE_PROBLEM_COPY.languageRequired
  }

  if (!values.description.trim()) {
    return TEACHER_CREATE_PROBLEM_COPY.descriptionRequired
  }

  if (values.testcases.length === 0) {
    return TEACHER_CREATE_PROBLEM_COPY.testcasesRequired
  }

  for (const testcase of values.testcases) {
    if (!testcase.input.trim()) {
      return TEACHER_CREATE_PROBLEM_COPY.inputRequired
    }

    if (!testcase.expected_output.trim()) {
      return TEACHER_CREATE_PROBLEM_COPY.expectedOutputRequired
    }
  }

  return null
}

export function getCreateProblemErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return TEACHER_CREATE_PROBLEM_COPY.saveError
  }

  if (!error.response) {
    return TEACHER_CREATE_PROBLEM_COPY.networkError
  }

  const responseCode = readApiResponseCode(error)

  if (responseCode === 'SPACE_NOT_FOUND' || error.response.status === 404) {
    return TEACHER_CREATE_PROBLEM_COPY.invalidSpace
  }

  if (error.response.status >= 500) {
    return TEACHER_CREATE_PROBLEM_COPY.serverError
  }

  return TEACHER_CREATE_PROBLEM_COPY.saveError
}
