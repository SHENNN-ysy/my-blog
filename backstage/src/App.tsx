import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import AdminLayout from '@/layouts/AdminLayout'
import MonitorDashboard from '@/views/admin/MonitorDashboard'

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
      <Routes>
        <Route path="/admin/login" element={<Navigate to="/admin" replace />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<div style={{ color: '#e6edf3', fontSize: 16 }}>Dashboard (开发中)</div>} />
          <Route path="monitor" element={<MonitorDashboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
