import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/common/ScrollToTop/ScrollToTop'
import ExamplePage from '@/pages/ExamplePage'
import LoginPage from '@/pages/LoginPage/LoginPage'
import SignupPage from '@/pages/SignupPage/SignupPage'
import AdditionalInfoPage from '@/pages/AdditionalInfoPage/AdditionalInfoPage'
import Header from '@/components/Header/Header'
import Footer from './components/Footer/Footer'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth/additional-info" element={<AdditionalInfoPage />} />

        <Route
          path="/*"
          element={
            <>
              <Header />
              <Routes>
                {/* 기본 라우트 */}
                <Route path="/*" element={<ExamplePage />} />

                {/* Student 안에 있는 파일은 /student의 경로로 시작 - 임시로 <ExamplePage />로 설정, 개발 후 변경하시면 됩니다! */}
                <Route path="/student/*" element={<ExamplePage />} />

                {/* Teacher 안에 있는 파일은 /teacher의 경로로 시작 - 임시로 <ExamplePage />로 설정, 개발 후 변경하시면 됩니다! */}
                <Route path="/teacher/*" element={<ExamplePage />} />
              </Routes>
              <Footer />
            </>
          }
        />
      </Routes>
    </>
  )
}

export default App
