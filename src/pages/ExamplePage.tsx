import { Code2 } from 'lucide-react'
import Button from '@/components/common/Button/Button'
import Card from '@/components/common/Card/Card'
import Badge from '@/components/common/Badge/Badge'
import Spinner from '@/components/common/Spinner/Spinner'
import PageHeader from '@/components/common/PageHeader/PageHeader'

// 필수* : TypeScript 필수값 (누락 시 에러)
const Required = ({ children }: { children: React.ReactNode }) => (
  <span className="text-neon-blue">{children}*</span>
)

type PropRow = {
  prop: string
  type: string
  default: string
  required?: boolean
}

function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <table className="text-body3 w-full border-collapse">
      <thead>
        <tr className="text-left text-gray-600">
          <th className="border-b border-gray-800 pr-6 pb-1 font-normal">
            prop
          </th>
          <th className="border-b border-gray-800 pr-6 pb-1 font-normal">
            타입
          </th>
          <th className="border-b border-gray-800 pb-1 font-normal">기본값</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ prop, type, default: def, required }) => (
          <tr key={prop}>
            <td className="text-light-background py-1 pr-6">
              {required ? <Required>{prop}</Required> : prop}
            </td>
            <td className="py-1 pr-6 text-gray-600">{type}</td>
            <td className="py-1 text-gray-600">{def}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function ExamplePage() {
  return (
    <div className="bg-background grid min-h-screen grid-cols-2 items-start gap-12 p-10">
      {/* ── 왼쪽 컬럼: PageHeader / Button / Card ── */}
      <div className="flex flex-col gap-12">
        {/* ── PageHeader ── */}
        <div className="flex flex-col gap-4">
          <p className="text-head3 text-light-background">PageHeader</p>
          <PropsTable
            rows={[
              {
                prop: 'children',
                type: 'ReactNode',
                default: 'pageTitle.ts 경로 기반',
              },
              { prop: 'onClick', type: '() => void', default: '—' },
            ]}
          />
          <p className="text-body3 text-neon-blue">
            * 경로 기반 제목 자동 표시 (src/constants/pageTitle.ts에서 등록
            필요)
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <PageHeader>children으로 직접 지정</PageHeader>
            <PageHeader onClick={() => alert('뒤로 가기 클릭')}>
              뒤로 가기
            </PageHeader>
          </div>
        </div>

        {/* ── Button ── */}
        <div className="flex flex-col gap-4">
          <p className="text-head3 text-light-background">Button</p>
          <PropsTable
            rows={[
              { prop: 'size', type: 'sm | md | lg | xl', default: 'lg' },
              { prop: 'width', type: 'Tailwind class', default: 'w-fit' },
              {
                prop: 'bgColor',
                type: 'Tailwind bg class',
                default: 'bg-neon-green',
              },
              {
                prop: 'textColor',
                type: 'Tailwind text class',
                default: 'text-black',
              },
              { prop: 'isLoading', type: 'boolean', default: 'false' },
              { prop: 'disabled', type: 'boolean', default: 'false' },
              {
                prop: 'loadingIndicator',
                type: 'ReactNode',
                default: '<Spinner />',
              },
              { prop: 'onClick', type: '() => void', default: '—' },
            ]}
          />
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">sm</Button>
            <Button size="md">md</Button>
            <Button size="lg">lg</Button>
            <Button size="xl">xl</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button isLoading>로딩</Button>
            <Button disabled>비활성</Button>
          </div>
        </div>

        {/* ── Card ── */}
        <div className="flex flex-col gap-4">
          <p className="text-head3 text-light-background">Card</p>
          <PropsTable
            rows={[
              { prop: 'width', type: 'Tailwind class', default: 'w-fit' },
              { prop: 'cursor', type: 'default | pointer', default: 'default' },
              { prop: 'onClick', type: '() => void', default: '—' },
            ]}
          />
          <Card>기본 카드</Card>
          <Card cursor="pointer" onClick={() => alert('카드 클릭')}>
            cursor=pointer (클릭 가능)
          </Card>
        </div>
      </div>

      {/* ── 오른쪽 컬럼: Spinner / Badge ── */}
      <div className="flex flex-col gap-12">
        {/* ── Spinner ── */}
        <div className="flex flex-col gap-4">
          <p className="text-head3 text-light-background">Spinner</p>
          <PropsTable
            rows={[
              { prop: 'size', type: 'sm | md | lg | xl', default: 'md' },
              {
                prop: 'color',
                type: 'Tailwind text class',
                default: '(currentColor 상속)',
              },
            ]}
          />
          <div className="flex flex-wrap items-center gap-4">
            <Spinner size="sm" color="text-neon-green" />
            <Spinner size="md" color="text-neon-green" />
            <Spinner size="lg" color="text-neon-green" />
            <Spinner size="xl" color="text-neon-green" />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Spinner size="md" color="text-neon-green" />
            <Spinner size="md" color="text-neon-blue" />
            <Spinner size="md" color="text-light-background" />
          </div>
        </div>

        {/* ── Spinner ── */}
        <div className="flex flex-col gap-4">
          <p className="text-head3 text-light-background">Badge</p>
          <PropsTable
            rows={[
              {
                prop: 'ariaLabel',
                type: 'string',
                default: '—',
                required: true,
              },
              { prop: 'size', type: 'sm | md | lg', default: 'md' },
              { prop: 'shape', type: 'circle | square', default: 'circle' },
              {
                prop: 'bgColor',
                type: 'Tailwind bg class',
                default: 'bg-neon-green',
              },
              {
                prop: 'textColor',
                type: 'Tailwind text class',
                default: 'text-black',
              },
              { prop: 'bgOpacity', type: '0 ~ 100', default: '—' },
            ]}
          />

          <p className="text-body3 text-gray-600">circle</p>
          <div className="flex flex-wrap items-center gap-4">
            <Badge size="sm" shape="circle" ariaLabel="sm 원형 뱃지">
              최
            </Badge>
            <Badge size="md" shape="circle" ariaLabel="md 원형 뱃지">
              최
            </Badge>
            <Badge size="lg" shape="circle" ariaLabel="lg 원형 뱃지">
              최
            </Badge>
          </div>

          <p className="text-body3 text-gray-600">square</p>
          <div className="flex flex-wrap items-center gap-4">
            <Badge size="sm" shape="square" ariaLabel="sm 사각 뱃지">
              최
            </Badge>
            <Badge size="md" shape="square" ariaLabel="md 사각 뱃지">
              최
            </Badge>
            <Badge size="lg" shape="square" ariaLabel="lg 사각 뱃지">
              최
            </Badge>
          </div>

          <p className="text-body3 text-gray-600">icon</p>
          <div className="flex flex-wrap items-center gap-4">
            <Badge size="sm" shape="circle" ariaLabel="sm 아이콘 뱃지">
              <Code2 size={16} />
            </Badge>
            <Badge size="md" shape="circle" ariaLabel="md 아이콘 뱃지">
              <Code2 size={20} />
            </Badge>
            <Badge size="md" shape="square" ariaLabel="md 사각 아이콘 뱃지">
              <Code2 size={20} />
            </Badge>
            <Badge size="lg" shape="circle" ariaLabel="lg 아이콘 뱃지">
              <Code2 size={40} />
            </Badge>
          </div>

          <p className="text-body3 text-gray-600">bgOpacity</p>
          <div className="flex flex-wrap items-center gap-4">
            <Badge
              size="md"
              shape="circle"
              bgOpacity={100}
              ariaLabel="opacity 100"
            >
              100
            </Badge>
            <Badge
              size="md"
              shape="circle"
              bgOpacity={50}
              ariaLabel="opacity 50"
            >
              50
            </Badge>
            <Badge
              size="md"
              shape="circle"
              bgOpacity={20}
              ariaLabel="opacity 20"
            >
              20
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExamplePage
