import { describe, expect, it } from 'vitest'
import { buildTeacherLineSelection } from './teacherLineComment'

describe('buildTeacherLineSelection', () => {
  it('일반 클릭 시 해당 줄만 선택한다', () => {
    expect(buildTeacherLineSelection(null, 3, false)).toEqual({
      anchorLine: 3,
      startLine: 3,
      endLine: 3,
    })
  })

  it('일반 클릭 시 앵커를 새 줄로 갱신한다', () => {
    expect(buildTeacherLineSelection(
      { anchorLine: 1, startLine: 1, endLine: 5 },
      8,
      false,
    )).toEqual({
      anchorLine: 8,
      startLine: 8,
      endLine: 8,
    })
  })

  it('Shift+클릭 시 앵커부터 클릭한 줄까지 범위를 선택한다', () => {
    expect(buildTeacherLineSelection(
      { anchorLine: 2, startLine: 2, endLine: 2 },
      5,
      true,
    )).toEqual({
      anchorLine: 2,
      startLine: 2,
      endLine: 5,
    })
  })

  it('Shift+클릭 시 앵커보다 위쪽 줄도 범위에 포함한다', () => {
    expect(buildTeacherLineSelection(
      { anchorLine: 5, startLine: 5, endLine: 5 },
      2,
      true,
    )).toEqual({
      anchorLine: 5,
      startLine: 2,
      endLine: 5,
    })
  })

  it('선택 없이 Shift+클릭하면 해당 줄만 선택한다', () => {
    expect(buildTeacherLineSelection(null, 4, true)).toEqual({
      anchorLine: 4,
      startLine: 4,
      endLine: 4,
    })
  })
})
