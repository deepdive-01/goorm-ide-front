import { Navigate, Route, Routes } from 'react-router-dom'
import SpaceListPage from '@/pages/SpaceListPage'

const Student = () => {
  return (
    <Routes>
      <Route
        path=":studentId/spaces"
        element={<Navigate to="/student/spaces" replace />}
      />
      <Route path="spaces" element={<SpaceListPage role="student" />} />
    </Routes>
  )
}

export default Student
