import { BRAND_NAME } from '@/constants/brand'

export const LANDING_COPY = {
  hero: {
    badge: '교육을 위한 코딩 플랫폼',
    title: '코딩 교육의 새로운 방식,',
    titleHighlight: BRAND_NAME,
    descriptionLine1:
      '강사와 학생이 하나의 화면을 공유하며 실시간으로 소통하는 인터랙티브 코딩 교육 플랫폼입니다.',
    descriptionLine2:
      '실시간 코드 확인과 즉각적인 피드백으로 학습 효율을 극대화하세요.',
    ctaPrimary: '시작하기',
    ctaSecondary: '로그인',
  },
  features: [
    {
      title: '실시간 코드 리뷰',
      description:
        '강사와 학습자가 같은 코드 화면을 보며 라인 단위 피드백과 즉각적인 소통을 진행합니다.',
    },
    {
      title: '브라우저 기반 실습 환경',
      description:
        '설치 없이 바로 실행되는 Web IDE로 이론부터 실습까지 한 공간에서 학습할 수 있습니다.',
    },
    {
      title: '라인별 피드백 시스템',
      description:
        '코드 특정 라인에 직접 피드백을 남기고 학습 흐름에 맞춘 리뷰를 제공합니다.',
    },
  ],
  showcase: {
    title: '코딩 학습에 최적화된 온라인 실습 공간',
    description:
      '강사는 문제를 출제하고 피드백을 제공하며, 학습자는 브라우저에서 바로 코드를 작성하고 제출할 수 있습니다.',
    highlights: [
      '실시간 코드 제출 및 리뷰',
      '강사 · 학습자 전용 학습방 관리',
      '브라우저 기반 Web IDE 제공',
    ],
    preview: {
      filename: 'main.py',
      feedbackTitle: '강사 피드백',
      feedbackLineRef: 'Line 6:',
      feedbackMessage:
        'return 값이 없습니다. sorted(arr)를 사용하거나 정렬 후 배열을 반환해주세요.',
      feedbackCode: 'sorted(arr)',
      feedbackTime: '방금 전',
      submitLabel: '제출 완료',
      reviewLabel: '리뷰 완료',
      runtimeLabel: 'Python 3.11',
      errorLineNumber: 6,
    },
  },
} as const
