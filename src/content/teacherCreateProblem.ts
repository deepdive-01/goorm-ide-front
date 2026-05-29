export const TEACHER_CREATE_PROBLEM_COPY = {
  pageTitle: '새 문항 만들기',
  invalidSpace: '유효한 스페이스를 찾을 수 없습니다.',
  save: '저장',
  saving: '저장 중…',
  saveError: '문항 저장에 실패했습니다. 입력 내용을 확인해 주세요.',
  basicInfoTitle: '기본 정보',
  basicInfoDescription: '문항의 기본 정보를 입력하세요.',
  titleLabel: '문항 제목',
  titlePlaceholder: '예: 두 수의 합',
  languageLabel: '프로그래밍 언어',
  descriptionLabel: '문제 설명',
  descriptionPlaceholder: '문제 설명을 작성하세요. Markdown 형식을 지원합니다.',
  starterCodeTitle: '시작 코드',
  starterCodeDescription: '학생에게 제공될 기본 코드입니다.',
  testcasesTitle: '테스트 케이스',
  testcasesDescription: '문항의 테스트 케이스를 설정하세요.',
  addTestcase: '추가',
  deleteTestcase: (index: number) => `테스트 케이스 ${index} 삭제`,
  testcaseLabel: (index: number) => `테스트 케이스 ${index}`,
  hidden: '숨김',
  visible: '공개',
  inputLabel: '입력',
  inputPlaceholder: '입력값',
  expectedOutputLabel: '예상 출력',
  expectedOutputPlaceholder: '예상 출력값',
  tipsTitle: '팁',
  tips: [
    '숨김 테스트 케이스는 학생에게 보이지 않지만 채점에 사용됩니다.',
    '다양한 엣지 케이스를 포함하면 더 좋은 문항이 됩니다.',
    '문제 설명에 Markdown 문법을 사용할 수 있습니다.',
  ],
} as const

export const DEFAULT_STARTER_CODE: Record<
  'PYTHON' | 'JAVA' | 'JAVASCRIPT' | 'CPP',
  string
> = {
  PYTHON: `# 두 수를 입력받아 합을 출력하세요
a, b = map(int, input().split())
print(a + b)
`,
  JAVA: `// 두 수를 입력받아 합을 출력하세요
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
    }
}
`,
  JAVASCRIPT: `// 두 수를 입력받아 합을 출력하세요
const input = require('fs').readFileSync(0, 'utf-8').trim().split(/\\s+/);
const a = Number(input[0]);
const b = Number(input[1]);
console.log(a + b);
`,
  CPP: `// 두 수를 입력받아 합을 출력하세요
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b;
    return 0;
}
`,
}
