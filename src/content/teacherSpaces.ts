export const TEACHER_SPACES_COPY = {
  title: '스페이스',
  subtitle: (name: string) => `${name}님의 교육 스페이스입니다.`,
  createButtonLabel: '새 스페이스',
  problemCount: (count: number) => `${count}문항`,
  memberCount: (count: number) => `${count}명`,
  lectureCount: (count: number) => `${count}개`,
  emptyTitle: '표시할 스페이스가 없습니다',
  emptyDescription: '새 스페이스를 만들어 수업을 시작해 보세요.',
  emptyHint: '우측 상단의 새 스페이스 버튼으로 첫 스페이스를 만들 수 있습니다.',
} as const
