import { useParams } from 'react-router-dom'

type SpaceListPageProps = {
  role: 'student' | 'teacher'
}

/** STU-01 / INS-01 연동 전 플레이스홀더 (Header/Footer는 App 전역) */
function SpaceListPage({ role }: SpaceListPageProps) {
  const params = useParams()
  const id = role === 'student' ? params.studentId : params.teacherId

  return (
    <main className="text-body1 text-gray-400 px-4 py-16 text-center">
      {role === 'student' ? '학습방 목록' : '강사 학습방 관리'}
      <span className="text-gray-600 mt-2 block text-sm">ID: {id}</span>
    </main>
  )
}

export default SpaceListPage
