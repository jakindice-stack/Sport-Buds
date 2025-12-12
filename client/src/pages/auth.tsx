import type { FormEvent } from 'react'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

type AuthVariant = 'login' | 'signup'

export const AuthPage = () => {
  const { signIn, signUp } = useAuth()
  const [variant, setVariant] = useState<AuthVariant>('login')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setStatus(null)

    try {
      if (variant === 'login') {
        const { error } = await signIn(email, password)
        if (error) {
          throw error
        }
        setStatus({ type: 'success', message: 'Logged in successfully.' })
      } else {
        const { error } = await signUp(email, password, fullName)
        if (error) {
          throw error
        }
        setStatus({
          type: 'success',
          message: 'Account created. Check your email for the confirmation link.',
        })
      }
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err?.message ?? 'Something went wrong. Please try again.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="space-y-8">
      <header className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--sb-muted)]">
          Sport Buds Access
        </p>
        <h2 className="font-display text-4xl font-semibold text-[var(--sb-text)]">
          {variant === 'login' ? 'Welcome back' : 'Join the community'}
        </h2>
        <p className="text-[var(--sb-muted)]">
          {variant === 'login'
            ? 'Use your email and password to access the MVP.'
            : 'Create an account to explore every prototype feature.'}
        </p>
      </header>

      <div className="flex justify-center gap-3">
        <button
          type="button"
          className={`chip ${variant === 'login' ? 'border-slate-900 bg-slate-900 text-white' : 'bg-white/70'}`}
          onClick={() => setVariant('login')}
        >
          Log In
        </button>
        <button
          type="button"
          className={`chip ${variant === 'signup' ? 'border-slate-900 bg-slate-900 text-white' : 'bg-white/70'}`}
          onClick={() => setVariant('signup')}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-4 rounded-3xl border border-[var(--sb-border)] bg-white/80 p-6">
        {variant === 'signup' && (
          <label className="flex flex-col gap-2 text-sm font-medium text-[var(--sb-text)]">
            Full name
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
              className="rounded-2xl border border-[var(--sb-border)] bg-white px-4 py-3 text-base text-[var(--sb-text)] focus:outline-none focus:ring-2 focus:ring-[var(--sb-accent)]"
            />
          </label>
        )}
        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--sb-text)]">
          Email address
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="rounded-2xl border border-[var(--sb-border)] bg-white px-4 py-3 text-base text-[var(--sb-text)] focus:outline-none focus:ring-2 focus:ring-[var(--sb-accent)]"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--sb-text)]">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="rounded-2xl border border-[var(--sb-border)] bg-white px-4 py-3 text-base text-[var(--sb-text)] focus:outline-none focus:ring-2 focus:ring-[var(--sb-accent)]"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-2xl bg-[var(--sb-accent)] px-4 py-3 text-base font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Please wait…' : variant === 'login' ? 'Log In' : 'Create Account'}
        </button>

        {status && (
          <p
            className={`text-sm ${status.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}
          >
            {status.message}
          </p>
        )}
      </form>
    </section>
  )
}
