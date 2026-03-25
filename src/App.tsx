import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar'
import JobSetup from './pages/JobSetup'
import ResumeUpload from './pages/ResumeUpload'
import ShortlistDashboard from './pages/ShortlistDashboard'

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<JobSetup />} />
        <Route path="/upload" element={<ResumeUpload />} />
        <Route path="/shortlist" element={<ShortlistDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
