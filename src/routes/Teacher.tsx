import { Route, Routes } from 'react-router-dom'
import ExamplePage from '@/pages/ExamplePage'

const Teacher = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Routes>
        <Route path="/" element={<ExamplePage />} />
      </Routes>
    </div>
  )
}

export default Teacher
