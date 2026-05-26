import { Route, Routes } from 'react-router-dom'
import SpaceListPage from '@/pages/teacher/SpaceListPage'

const Teacher = () => {
  return (
    <Routes>
      <Route path="spaces" element={<SpaceListPage />} />
    </Routes>
  )
}

export default Teacher
