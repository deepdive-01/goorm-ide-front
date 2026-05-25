import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/common/ScrollToTop/ScrollToTop'
import ExamplePage from '@/pages/ExamplePage'
import LoginPage from '@/pages/auth/LoginPage'
import SignupPage from '@/pages/auth/SignupPage'
import AdditionalInfoPage from '@/pages/auth/AdditionalInfoPage'
import OAuthCallbackPage from '@/pages/auth/OAuthCallbackPage'
import Header from '@/components/Header/Header'
import Footer from './components/Footer/Footer'
import LandingPage from '@/pages/LandingPage'
import SpacesEntryRedirect from '@/pages/SpacesEntryRedirect'
import Student from '@/routes/Student'
import Teacher from '@/routes/Teacher'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
        <Route path="/oauth/signup" element={<AdditionalInfoPage />} />

        <Route
          path="/*"
          element={
            <div className="bg-background text-light-background flex min-h-screen flex-col">
              <Header />
              <div className="flex flex-1 flex-col">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/spaces" element={<SpacesEntryRedirect />} />

                  <Route path="/student/*" element={<Student />} />

                  <Route path="/teacher/*" element={<Teacher />} />

                  {/* 기본 라우트 */}
                  <Route path="/*" element={<ExamplePage />} />
                </Routes>
              </div>
              <Footer />
            </div>
          }
        />
      </Routes>
    </>
  )
}

export default App
