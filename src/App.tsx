import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/common/ScrollToTop/ScrollToTop'
import ExamplePage from '@/pages/ExamplePage'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* 기본 라우트 */}
        <Route path="/*" element={<ExamplePage />} />

        {/* Student 안에 있는 파일은 /student의 경로로 시작 - 임시로 <ExamplePage />로 설정, 개발 후 변경하시면 됩니다! */}
        <Route path="/student/*" element={<ExamplePage />} />

        {/* Teacher 안에 있는 파일은 /teacher의 경로로 시작 - 임시로 <ExamplePage />로 설정, 개발 후 변경하시면 됩니다! */}
        <Route path="/teacher/*" element={<ExamplePage />} />
      </Routes>
    </>
  )
}

export default App
