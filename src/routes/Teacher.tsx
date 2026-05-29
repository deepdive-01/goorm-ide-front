import { Route, Routes } from 'react-router-dom'
import CreateProblemPage from '@/pages/teacher/CreateProblemPage'
import InviteStudentsPage from '@/pages/teacher/InviteStudentsPage'
import SpaceDetailPage from '@/pages/teacher/SpaceDetailPage'
import SpaceListPage from '@/pages/teacher/SpaceListPage'

const Teacher = () => {
  return (
    <Routes>
      <Route path="spaces" element={<SpaceListPage />} />
      <Route path="spaces/:spaceId" element={<SpaceDetailPage />} />
      <Route path="spaces/:spaceId/problems-create" element={<CreateProblemPage />} />
      <Route path="spaces/:spaceId/invite" element={<InviteStudentsPage />} />
    </Routes>
  )
}

export default Teacher
