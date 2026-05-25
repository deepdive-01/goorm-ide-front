export const STUDENT_PROBLEMS_COPY = {
  backToSpaces: '스페이스 목록',
  sectionTitle: '문항 목록',
  mentorLabel: (name: string) => `${name} 강사`,
  testCaseCount: (count: number) => `${count}개 테스트 케이스`,
  emptyTitle: '표시할 문항이 없습니다',
  emptyDescription: '강사가 문항을 등록하면 이곳에 표시됩니다.',
  statusCompleted: '완료',
  statusSubmitted: '제출됨',
  statusNotSubmitted: '미제출',
  invalidSpace: '스페이스를 찾을 수 없습니다.',
} as const
