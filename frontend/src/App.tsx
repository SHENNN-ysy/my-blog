import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import HomePage from '@/pages/HomePage'
import ExperimentsPage from '@/pages/ExperimentsPage'
import NotesPage from '@/pages/NotesPage'
import AboutPage from '@/pages/AboutPage'
import ExplorePage from '@/pages/ExplorePage'
import NotFoundPage from '@/pages/NotFoundPage'

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/experiments" element={<ExperimentsPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
