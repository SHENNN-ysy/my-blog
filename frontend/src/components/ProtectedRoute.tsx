import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const location = useLocation()

  if (!isLoggedIn) {
    return <Navigate to="/explore" state={{ from: location }} replace />
  }

  return <>{children}</>
}

interface GuestRouteProps {
  children: React.ReactNode
}

export function GuestRoute({ children }: GuestRouteProps) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const location = useLocation()

  if (isLoggedIn) {
    const from = (location.state as { from?: Location })?.from
    return <Navigate to={from?.pathname ?? '/'} replace />
  }

  return <>{children}</>
}
