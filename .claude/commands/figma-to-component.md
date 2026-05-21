# Figma → Component 생성 스킬

Figma 컴포넌트를 분석해서 이 프로젝트 컨벤션에 맞는 React 컴포넌트 (+ Storybook 스토리)를 생성한다.
공통 컴포넌트와 페이지 컴포넌트 두 경로를 모두 지원한다.

## 사용법

```
/figma-to-component [Figma URL 또는 컴포넌트 이름]
```

---

## 프로젝트 컨텍스트

### 폴더 구조

```
src/
├── components/
│   ├── common/               ← 공통 재사용 컴포넌트 + Storybook 대상
│   │   └── [ComponentName]/
│   │       ├── [ComponentName].tsx
│   │       └── [ComponentName].stories.tsx
│   └── layout/              ← 헤더, 사이드바 등 레이아웃
├── pages/
│   ├── TestPage.tsx          ← 공통 컴포넌트 예시 안내 페이지
│   └── [PageName]/
│       └── components/      ← 페이지 전용 컴포넌트 (Storybook 없음)
│           └── [ComponentName]/
│               └── [ComponentName].tsx
├── types/                   ← 모든 공통/페이지 컴포넌트 타입 정의
│   └── common.type.ts       ← 공통 컴포넌트 Props 인터페이스
├── hooks/                   ← 공통 커스텀 훅
├── services/                ← API 함수, 외부 라이브러리 호출
├── utils/                   ← 순수 유틸리티 함수
├── constants/               ← 상수값
├── contexts/                ← React Context
└── features/                ← 도메인 단위 기능 묶음
```

> 이 스킬은 UI 컴포넌트만 구현한다. hooks/services/contexts 등은 참고용으로만 인지한다.

### 두 경로 비교

| 항목          | 공통 컴포넌트                   | 페이지 컴포넌트                           |
| ------------- | ------------------------------- | ----------------------------------------- |
| 위치          | `src/components/common/[Name]/` | `src/pages/[PageName]/components/[Name]/` |
| 타입 정의     | `src/types/common.type.ts`      | `src/types/[pageName].type.ts`            |
| Storybook     | 생성 O                          | 생성 X                                    |
| TestPage 예시 | 추가 O                          | 추가 X                                    |
| 재사용성      | 앱 전체에서 재사용              | 해당 페이지 전용                          |

### 디자인 시스템 토큰

**컬러** (`src/styles/theme.css`)

- Background: `bg-background` (#060606)
- Light Background: `bg-light-background` (#fdfdfd)
- Neon Green: `bg-neon-green` / `text-neon-green` (#7bf179)
- Neon Blue: `bg-neon-blue` / `text-neon-blue` (#32ebe1)
- Gray 600 (설명 텍스트): `text-gray-600` (#6e6e6e)
- Gray 800 (border): `border-gray-800` (#3c3c3c)
- Gray 900 (탭 배경): `bg-gray-900` (#212121)
- Black (버튼 텍스트): `text-black` (#111111)

> ⚠️ Figma에서 위 토큰에 없는 색상이 발견되면 **반드시 개발자에게 먼저 확인** 후 추가한다. 임의로 hex 직접 사용 금지.

**타이포그래피** (`src/styles/typography.css`)

- `text-hero`: 60px / 600
- `text-head1`: 35px / 600
- `text-head2`: 30px / 700
- `text-head3`: 18px / 600
- `text-body1`: 16px / 500
- `text-body2`: 14px / 400
- `text-body3`: 12px / 400

**폰트**: Pretendard (전역 적용)

### 컴포넌트 컨벤션

- 함수형 컴포넌트만 사용 (클래스형 금지)
- **컴포넌트는 최대한 작은 단위로 분리** — 역할이 다르면 별도 파일로 분리
- **공통 컴포넌트** props → `src/types/common.type.ts`에 interface 정의 후 import
- **페이지 컴포넌트** props → `src/types/[pageName].type.ts`에 interface 정의 후 import
- **모든 props는 선택적(`?`)으로 작성** — 생성 후 개발자에게 필수 여부 안내
- Tailwind CSS 클래스 사용 (동적 클래스 자유롭게 사용 가능)
- 모든 주석은 한국어로 작성

### 공통 컴포넌트 수정 규칙

> **공통 컴포넌트를 생성하거나 수정할 때는 반드시 아래 세 가지를 함께 처리한다.**

1. `[ComponentName].tsx` — 컴포넌트 본체
2. `[ComponentName].stories.tsx` — 변경된 props/상태 반영
3. `src/pages/TestPage.tsx` — 아래 규칙에 따라 업데이트

**props 변경 시**: 해당 컴포넌트의 `PropsTable` rows 배열을 실제 props와 동일하게 수정한다 (추가/삭제/타입 변경 모두 반영).

**새 컴포넌트 추가 시**: Step 6 형식에 따라 새 섹션을 추가한다.

### 고정 크기 컴포넌트 구현 패턴

1:1 비율(정사각형/원)이 필요한 컴포넌트는 `aspect-square`가 텍스트 line-height로 인해 신뢰성이 없으므로 `w-{n} h-{n}`으로 명시적 크기를 지정한다.

```tsx
// ✅ 명시적 고정 크기
const sizeStyles: Record<Size, string> = {
  sm: 'w-10 h-10', // 40px × 40px
  md: 'w-12 h-12', // 48px × 48px
  lg: 'w-[90px] h-[90px]',
}

// ❌ aspect-square — 텍스트 line-height 때문에 비율이 깨질 수 있음
```

### 참고 컴포넌트 패턴

**Button** (`src/components/common/Button/Button.tsx`)

```tsx
import type { ButtonProps, ButtonSize } from '../../../types/common.type'
import Spinner from '../Spinner/Spinner'

function Button({
  children,
  width = 'w-fit',
  bgColor,
  textColor,
  size = 'lg',
  isLoading = false,
  disabled = false,
  onClick,
}: ButtonProps) {
  const isDisabled = isLoading || disabled
  return (
    <button
      type="button"
      disabled={isDisabled}
      className={`text-body1 flex items-center justify-center gap-2 rounded-lg px-4 ${width} ${sizeStyles[size]} ${bgColor ?? ''} ${textColor ?? ''} ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
      onClick={onClick}
    >
      {isLoading && <Spinner />}
      {children}
    </button>
  )
}
```

**Badge** (`src/components/common/Badge/Badge.tsx`)

```tsx
import type {
  BadgeProps,
  BadgeSize,
  BadgeShape,
} from '../../../types/common.type'

// 고정 크기 + 배경 레이어 분리 패턴
function Badge({
  children,
  size = 'md',
  shape = 'circle',
  bgColor = 'bg-neon-green',
  bgOpacity,
  textColor = 'text-black',
  ariaLabel,
}: BadgeProps) {
  return (
    <span
      aria-label={ariaLabel}
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden ${sizeStyles[size]} ${shapeStyles[shape]} ${textColor}`}
    >
      <span
        className={`absolute inset-0 ${bgColor}`}
        style={
          bgOpacity !== undefined ? { opacity: bgOpacity / 100 } : undefined
        }
      />
      <span className="relative">{children}</span>
    </span>
  )
}
```

---

## 실행 워크플로우

### Step 0 — 컴포넌트 경로 결정

Figma 컴포넌트 이름과 구조를 보고 아래 기준으로 경로를 판단한다.
**판단이 애매하면 반드시 개발자에게 먼저 확인한다.**

```
"이 컴포넌트가 다른 페이지에서도 재사용되는가?"
  YES → [공통] src/components/common/
  NO  → [페이지] src/pages/[PageName]/components/
```

이후 각 단계에서 `[공통]` / `[페이지]` 태그로 해당 경로를 명시한다.

### Step 1 — Figma 파일 분석

Figma URL에서 파일 키를 추출하고 MCP 또는 REST API로 컴포넌트 구조를 분석한다.

```
파일 키 추출: https://www.figma.com/design/{FILE_KEY}/...
REST API: GET https://api.figma.com/v1/files/{FILE_KEY}/nodes?ids={NODE_ID}
          Header: X-Figma-Token: {FIGMA_API_TOKEN}  ← .mcp.json 참조
```

분석할 항목:

- 컴포넌트 레이아웃 (flex/grid, padding, gap, border-radius, cornerRadius)
- 색상 → 프로젝트 토큰으로 매핑 (없는 색상은 개발자 확인 필수)
- 폰트 크기/굵기 → 프로젝트 타이포그래피 유틸로 매핑
- 상태 (default, hover, disabled, loading 등)
- 1:1 비율 필요 여부 (절대 크기 → `w-{n} h-{n}` 패턴 사용)
- 분리 가능한 하위 컴포넌트 식별

### Step 2 — 컴포넌트 분리 계획

Figma 구조를 보고 컴포넌트를 최대한 작은 단위로 나눈다.

예시:

```
InputField
├── InputLabel.tsx      ← 라벨
├── InputBox.tsx        ← 입력창
├── InputHelperText.tsx ← 안내/에러 메시지
└── InputField.tsx      ← 위 조합
```

분리 기준:

- 다른 곳에서 재사용 가능한가?
- 독립적인 역할을 가지는가?
- 15줄 이상인가?

### Step 3 — 타입 정의

**[공통]** `src/types/common.type.ts`에 interface 추가:

```ts
export type [ComponentName]Size = 'sm' | 'md' | 'lg'  // 사이즈 변형이 있는 경우

export interface [ComponentName]Props {
  children?: React.ReactNode
  size?: [ComponentName]Size
  bgColor?: string    // Tailwind bg 클래스
  bgOpacity?: number  // 배경 투명도 0~100 (배경 레이어 분리 패턴 사용 시)
  textColor?: string  // Tailwind text 클래스
  ariaLabel?: string
  onClick?: () => void | Promise<void>
}
```

**[페이지]** `src/types/[pageName].type.ts`에 interface 추가 (파일 없으면 신규 생성):

```ts
export interface [ComponentName]Props {
  children?: React.ReactNode
  onClick?: () => void | Promise<void>
}
```

생성 후 개발자에게 안내:

> 아래 props는 필수(`?` 제거)로 변경하는 것을 권장합니다.
>
> - `[prop명]`: [이유]

### Step 4 — 컴포넌트 생성

각 파일 생성:

- Figma 구조 → Tailwind 클래스로 변환
- 색상/타이포는 반드시 프로젝트 토큰 사용
- 접근성 속성 추가 (aria-label, aria-disabled 등)
- 1:1 비율 필요 시 `w-{n} h-{n}` 명시적 크기 사용
- 배경 투명도 필요 시 배경 레이어 분리 패턴 적용

**[공통]** 생성 위치: `src/components/common/[ComponentName]/[ComponentName].tsx`

**[페이지]** 생성 위치: `src/pages/[PageName]/components/[ComponentName]/[ComponentName].tsx`

### Step 5 — Storybook 스토리 생성

**[공통] 전용** — 페이지 컴포넌트는 이 단계를 건너뛴다.

```tsx
const meta = {
  component: [ComponentName],
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#060606' }],
    },
  },
} satisfies Meta<typeof [ComponentName]>
```

Figma에 있는 상태(default, hover, disabled 등)와 모든 props 변형을 스토리로 표현한다.

### Step 6 — TestPage 예시 추가

**[공통] 전용** — `src/pages/TestPage.tsx`에 아래 형식으로 새 섹션을 추가한다.

```tsx
{/* ── ComponentName ── */}
<div className="flex flex-col gap-4">
  <p className="text-head3 text-light-background">ComponentName</p>
  <PropsTable
    rows={[
      { prop: 'propName', type: '타입', default: '기본값' },
      { prop: 'requiredProp', type: '타입', default: '—', required: true },
    ]}
  />
  {/* props 주요 variant별로 섹션 분리 */}
  <p className="text-body3 text-gray-600">variant 이름 등</p>
  <div className="flex flex-wrap items-center gap-3">
    <ComponentName prop="value">예시</ComponentName>
  </div>
</div>
```

규칙:
- 섹션은 왼쪽/오른쪽 컬럼(`grid-cols-2`) 중 적절한 위치에 배치
- `PropsTable` rows는 실제 컴포넌트 props와 완전히 일치시킬 것
- 필수 props는 `required: true` 표시
- props의 주요 variant/옵션별로 예시를 나눠서 보여줄 것

### Step 7 — 검증

- `npm run type-check` 통과 확인
- 개발자에게 필수 props 후보 안내
- 신규 색상 토큰이 필요했다면 추가 여부 확인
