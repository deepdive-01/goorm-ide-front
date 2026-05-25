import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import ProblemListPage from '@/pages/ProblemListPage'
import SpaceListPage from '@/pages/SpaceListPage'

function LegacyStudentProblemListRedirect() {
  const { spaceId } = useParams()
  return (
    <Navigate to={`/student/spaces/${spaceId}/problems`} replace />
  )
}

const Student = () => {
  return (
    <Routes>
      <Route
        path=":studentId/spaces"
        element={<Navigate to="/student/spaces" replace />}
      />
      <Route
        path=":studentId/spaces/:spaceId/problems"
        element={<LegacyStudentProblemListRedirect />}
      />
      <Route path="spaces" element={<SpaceListPage role="student" />} />
      <Route path="spaces/:spaceId/problems" element={<ProblemListPage />} />
    </Routes>
  )
}

export default Student
