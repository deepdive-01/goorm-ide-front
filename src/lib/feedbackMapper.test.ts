import { describe, expect, it } from 'vitest'
import {
  filterFeedbacksForSubmission,
  findOverallFeedbackComment,
  mapFeedbacksToStudentViews,
  mapHighlightsToTeacherLineComments,
  normalizeFeedbackItem,
} from '@/lib/feedbackMapper'

describe('feedbackMapper', () => {
  it('snake_case 피드백 항목을 정규화한다', () => {
    expect(
      normalizeFeedbackItem({
        feedback_id: 3,
        type: 'HIGHLIGHT',
        content: '좋아요',
        created_by: '김강사',
        created_at: '2026-05-14T18:00:00Z',
        start_line: 2,
        end_line: 4,
        color: 'YELLOW',
      }),
    ).toEqual({
      feedback_id: 3,
      type: 'HIGHLIGHT',
      content: '좋아요',
      created_by: '김강사',
      created_at: '2026-05-14T18:00:00Z',
      start_line: 2,
      end_line: 4,
      color: 'YELLOW',
    })
  })

  it('HIGHLIGHT을 강사 줄 코멘트로 변환한다', () => {
    const feedbacks = [
      normalizeFeedbackItem({
        feedback_id: 1,
        type: 'HIGHLIGHT',
        content: 'map 함수를 사용해 깔끔하게 처리했네요!',
        created_by: '김강사',
        created_at: '2026-05-14T18:00:00Z',
        start_line: 2,
        end_line: 2,
      }),
      normalizeFeedbackItem({
        feedback_id: 2,
        type: 'COMMENT',
        content: '전체 피드백',
        created_by: '김강사',
        created_at: '2026-05-14T19:00:00Z',
      }),
    ]

    expect(mapHighlightsToTeacherLineComments(feedbacks)).toEqual([
      {
        id: '1',
        startLine: 2,
        endLine: 2,
        message: 'map 함수를 사용해 깔끔하게 처리했네요!',
      },
    ])
    expect(findOverallFeedbackComment(feedbacks)?.feedback_id).toBe(2)
  })

  it('학생 탭용 피드백 뷰로 분리한다', () => {
    const feedbacks = [
      normalizeFeedbackItem({
        feedback_id: 10,
        type: 'COMMENT',
        content: '잘 작성했습니다',
        created_by: '김강사',
        created_at: '2026-05-14T18:00:00Z',
      }),
      normalizeFeedbackItem({
        feedback_id: 11,
        type: 'HIGHLIGHT',
        content: '줄 코멘트',
        created_by: '김강사',
        created_at: '2026-05-14T18:30:00Z',
        start_line: 1,
        end_line: 1,
      }),
    ]

    const views = mapFeedbacksToStudentViews(feedbacks)
    expect(views.submissionFeedback).toHaveLength(1)
    expect(views.codeComments).toHaveLength(1)
    expect(views.codeComments[0].lineNumber).toBe(1)
    expect(views.codeComments[0].endLineNumber).toBeUndefined()
  })

  it('여러 줄 HIGHLIGHT은 endLineNumber를 포함한다', () => {
    const views = mapFeedbacksToStudentViews([
      normalizeFeedbackItem({
        feedback_id: 12,
        type: 'HIGHLIGHT',
        content: '범위 코멘트',
        created_by: '김강사',
        created_at: '2026-05-14T18:30:00Z',
        start_line: 2,
        end_line: 5,
      }),
    ])

    expect(views.codeComments[0]).toMatchObject({
      lineNumber: 2,
      endLineNumber: 5,
    })
  })

  it('submitted_at 이전 피드백은 재제출 회차에서 제외한다', () => {
    const feedbacks = [
      normalizeFeedbackItem({
        feedback_id: 1,
        type: 'HIGHLIGHT',
        content: '이전 제출 코멘트',
        created_by: '김강사',
        created_at: '2026-06-01T10:00:00Z',
        start_line: 1,
        end_line: 1,
      }),
      normalizeFeedbackItem({
        feedback_id: 2,
        type: 'HIGHLIGHT',
        content: '현재 제출 코멘트',
        created_by: '김강사',
        created_at: '2026-06-03T11:00:00Z',
        start_line: 2,
        end_line: 2,
      }),
    ]

    expect(
      filterFeedbacksForSubmission(feedbacks, '2026-06-03T10:00:00Z'),
    ).toHaveLength(1)
    expect(
      filterFeedbacksForSubmission(feedbacks, '2026-06-03T10:00:00Z')[0]?.feedback_id,
    ).toBe(2)
  })
})
