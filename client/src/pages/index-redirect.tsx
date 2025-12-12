import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export const IndexRedirect = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-[40vh] rounded-3xl border border-[var(--sb-border)] bg-white/80 p-6">
        Loading…
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return <Navigate to="/app/dashboard" replace />
}
