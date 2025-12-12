import type { ReactNode } from 'react'
import React from 'react'

type ErrorBoundaryState = {
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

export class ErrorBoundary extends React.Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null, errorInfo: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo })
  }

  private copyDetails = async () => {
    const payload = {
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    }

    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
    } catch (_) {
      // no-op
    }
  }

  private reset = () => {
    this.setState({ error: null, errorInfo: null })
  }

  render() {
    if (!this.state.error) {
      return this.props.children
    }

    return (
      <div className="min-h-[40vh] rounded-3xl border border-[var(--sb-border)] bg-white/80 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--sb-muted)]">Something went wrong</p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-[var(--sb-text)]">We hit an unexpected error.</h2>
        <p className="mt-2 text-sm text-[var(--sb-muted)]">Try reloading this screen. If it keeps happening, copy the error details.</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" className="chip border-slate-900 bg-slate-900 text-white" onClick={this.reset}>
            Try again
          </button>
          <button type="button" className="chip bg-white" onClick={this.copyDetails}>
            Copy error details
          </button>
        </div>

        <pre className="mt-5 max-h-64 overflow-auto rounded-2xl border border-[var(--sb-border)] bg-white p-4 text-xs text-slate-700">
          {(this.state.error?.stack || this.state.error?.message) ?? 'Unknown error'}
        </pre>
      </div>
    )
  }
}
