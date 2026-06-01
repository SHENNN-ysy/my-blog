import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { GuestRoute } from '@/components/ProtectedRoute'
import HomePage from '@/pages/HomePage'
import ExperimentsPage from '@/pages/ExperimentsPage'
import NotesPage from '@/pages/NotesPage'
import AboutPage from '@/pages/AboutPage'
import ExplorePage from '@/pages/ExplorePage'
import NotFoundPage from '@/pages/NotFoundPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/experiments" element={<ExperimentsPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/about" element={<AboutPage />} />

        <Route
          path="/explore"
          element={
            <GuestRoute>
              <ExplorePage />
            </GuestRoute>
          }
        />

        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
