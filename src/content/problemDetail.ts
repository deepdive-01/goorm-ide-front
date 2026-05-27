export const PROBLEM_DETAIL_COPY = {
  description: '문제 설명',
  inputFormat: '입력 형식',
  outputFormat: '출력 형식',
  examples: '예제',
  example: (index: number) => `EXAMPLE ${index}`,
  inputLabel: 'Input',
  outputLabel: 'Output',
  constraints: 'CONSTRAINTS',
} as const

export type ProblemDetailExtras = {
  inputFormatLines: string[]
  outputFormatLines: string[]
  constraints?: string[]
  exampleExplanations?: string[]
}

export const PROBLEM_DETAIL_EXTRAS_BY_ID: Record<number, ProblemDetailExtras> = {
  1: {
    inputFormatLines: [
      '첫째 줄에 정수 a, b가 주어진다.',
      '(-1000 ≤ a, b ≤ 1000)',
    ],
    outputFormatLines: ['a와 b의 합을 한 줄에 출력한다.'],
    constraints: ['-1000 ≤ a, b ≤ 1000', '입력은 항상 유효한 정수이다.'],
    exampleExplanations: [
      'a + b = 3 + 5 = 8 이므로 8을 출력합니다.',
      '10 + 20 = 30 이므로 30을 출력합니다.',
    ],
  },
  2: {
    inputFormatLines: ['첫째 줄에 정수 n이 주어진다.', 'n ≥ 0'],
    outputFormatLines: ['n번째 피보나치 수를 한 줄에 출력한다.'],
    constraints: ['0 ≤ n ≤ 30'],
  },
  3: {
    inputFormatLines: [
      '첫째 줄에 배열 길이 n, target이 주어진다.',
      '둘째 줄에 오름차순 정렬된 n개의 정수가 주어진다.',
    ],
    outputFormatLines: ['target의 인덱스를 한 줄에 출력한다. (없으면 -1)'],
    constraints: ['1 ≤ n ≤ 10^4'],
  },
}
