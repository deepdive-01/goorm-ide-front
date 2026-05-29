import { Route, Routes } from 'react-router-dom'
import SpaceDetailPage from '@/pages/teacher/SpaceDetailPage'
import SpaceListPage from '@/pages/teacher/SpaceListPage'

const Teacher = () => {
  return (
    <Routes>
      <Route path="spaces" element={<SpaceListPage />} />
      <Route path="spaces/:spaceId" element={<SpaceDetailPage />} />
    </Routes>
  )
}

export default Teacher
