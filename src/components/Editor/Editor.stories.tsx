import type { Meta, StoryObj } from '@storybook/react-vite'
import Editor from './Editor'

const SAMPLE_CODE = `a, b = map(int, input().split())
print(a + b)`

const meta = {
  component: Editor,
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#060606' }],
    },
    layout: 'padded',
    // Monaco Editor는 CDN에서 worker 스크립트를 로드합니다.
    // Playwright 병렬 실행 환경에서 CDN 요청이 실패할 수 있으므로
    // 해당 unhandled NetworkError는 무시합니다.
    test: {
      dangerouslyIgnoreUnhandledErrors: true,
    },
  },
  args: {
    language: 'PYTHON',
    value: SAMPLE_CODE,
    onChange: () => {},
    onLanguageChange: () => {},
    onRun: () => {},
    onSave: () => {},
    onSubmit: () => {},
    height: '200px',
    className: 'w-full',
  },
} satisfies Meta<typeof Editor>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: '기본',
}

export const WithEmptyCode: Story = {
  name: '코드 없음',
  args: {
    value: '',
  },
}

export const Disabled: Story = {
  name: '비활성화 (초기 로딩 중)',
  args: {
    disabled: true,
  },
}

export const Running: Story = {
  name: '실행 중',
  args: {
    isRunning: true,
  },
}

export const Saving: Story = {
  name: '저장 중',
  args: {
    isSaving: true,
  },
}

export const Submitting: Story = {
  name: '제출 중',
  args: {
    isSubmitting: true,
  },
}

export const WithExecutionSuccess: Story = {
  name: '실행 성공 (STDOUT)',
  args: {
    executionResult: {
      status: 'SUCCESS',
      output: '8\n4\n',
      stderr: '',
    },
  },
}

export const WithExecutionError: Story = {
  name: '실행 오류 (에러 탭 자동 전환)',
  args: {
    executionResult: {
      status: 'ERROR',
      output: '',
      stderr:
        'Traceback (most recent call last):\n  File "main.py", line 1, in <module>\nNameError: name \'x\' is not defined',
    },
  },
}

export const WithGradePass: Story = {
  name: '채점 결과 PASS',
  args: {
    executionResult: {
      status: 'SUCCESS',
      output: '8\n',
      stderr: '',
    },
    gradeResult: {
      status: 'PASS',
      pass_count: 3,
      total_count: 3,
      results: [
        {
          order_num: 1,
          passed: true,
          input: '3 5',
          expected_output: '8',
          actual_output: '8',
        },
        {
          order_num: 2,
          passed: true,
          input: '10 20',
          expected_output: '30',
          actual_output: '30',
        },
        {
          order_num: 3,
          passed: true,
          input: '0 0',
          expected_output: '0',
          actual_output: '0',
        },
      ],
    },
  },
}

export const WithGradeFail: Story = {
  name: '채점 결과 FAIL',
  args: {
    executionResult: {
      status: 'SUCCESS',
      output: '8\n',
      stderr: '',
    },
    gradeResult: {
      status: 'FAIL',
      pass_count: 1,
      total_count: 3,
      results: [
        {
          order_num: 1,
          passed: true,
          input: '3 5',
          expected_output: '8',
          actual_output: '8',
        },
        {
          order_num: 2,
          passed: false,
          input: '10 20',
          expected_output: '30',
          actual_output: '0',
        },
        {
          order_num: 3,
          passed: false,
          input: '0 0',
          expected_output: '0',
          actual_output: '1',
        },
      ],
    },
  },
}

export const ReadOnly: Story = {
  name: '읽기 전용 (강사 코드 조회)',
  args: {
    readOnly: true,
    onRun: undefined,
    onSave: undefined,
    onSubmit: undefined,
  },
}

export const JavaLanguage: Story = {
  name: 'Java 언어',
  args: {
    language: 'JAVA',
    value: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a + b);
    }
}`,
  },
}
