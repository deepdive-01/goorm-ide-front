/// <reference types="vite/client" />
import type { Preview } from '@storybook/react-vite'
import '../src/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      /* 
      'todo' - 접근성 위반 사항을 테스트 UI에 표시만 하고 실패 처리 안 함
      'error' - 접근성 위반 사항이 있으면 테스트 실패 (CI 차단)
      'off' - 접근성 검사 건너뜀

      접근성 위반 사항의 예 -> <img> 에 alt 없는 경우, 아이콘 버튼에 aria-label 없는 경우, 텍스트/배경 명암비 4.5:1 미달인 경우 등등
      해당 프로젝트의 경우 props로 자유롭게 받는 구조기 때문에 접근성 위반사항이 발생할 가능성이 있어 todo로 설정했습니다
       */
      test: 'todo',
    },
  },
}

export default preview
