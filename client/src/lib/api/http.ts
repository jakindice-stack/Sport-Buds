const API_BASE = import.meta.env.VITE_API_BASE

const normalizeBase = (base: string) => base.replace(/\/$/, '')
export const apiBaseConfigError = !API_BASE ? 'Missing VITE_API_BASE environment variable' : null
const baseUrl = API_BASE ? normalizeBase(API_BASE) : ''

const ensureLeadingSlash = (path: string) => (path.startsWith('/') ? path : `/${path}`)

type RequestConfig = Omit<RequestInit, 'body'> & {
  body?: unknown
}

export type CorrelatedError = Error & { correlationId?: string; status?: number }

const AUTH_OVERRIDE_KEY = 'sb_auth_token_override'

export const setAuthTokenOverride = (token: string) => {
  try {
    localStorage.setItem(AUTH_OVERRIDE_KEY, token)
  } catch (_) {
    // no-op
  }
}

export const clearAuthTokenOverride = () => {
  try {
    localStorage.removeItem(AUTH_OVERRIDE_KEY)
  } catch (_) {
    // no-op
  }
}

const getAuthTokenOverride = (): string | null => {
  try {
    return localStorage.getItem(AUTH_OVERRIDE_KEY)
  } catch (_) {
    return null
  }
}

const buildRequestInit = ({ body, headers, ...config }: RequestConfig = {}): RequestInit => {
  const init: RequestInit = {
    ...config,
  }

  if (body !== undefined) {
    init.body = JSON.stringify(body)
    init.headers = {
      'Content-Type': 'application/json',
      ...headers,
    }
  } else if (headers) {
    init.headers = headers
  }

  return init
}

const parseResponse = async <T>(response: Response): Promise<T> => {
  if (response.status === 204) {
    return undefined as T
  }

  const contentType = response.headers.get('content-type') ?? ''

  if (!contentType.includes('application/json')) {
    const text = await response.text()
    return (text as unknown) as T
  }

  return (await response.json()) as T
}

const request = async <T>(path: string, config?: RequestConfig): Promise<T> => {
  if (!API_BASE) {
    throw new Error('Missing VITE_API_BASE environment variable')
  }
  const url = path.startsWith('http') ? path : `${baseUrl}${ensureLeadingSlash(path)}`
  const init = buildRequestInit(config)

  const correlationId =
    (globalThis.crypto && 'randomUUID' in globalThis.crypto && globalThis.crypto.randomUUID()) ||
    `cid_${Math.random().toString(16).slice(2)}_${Date.now()}`

  init.headers = {
    ...(init.headers ?? {}),
    'x-correlation-id': correlationId,
  }

  try {
    const { supabase } = await import('@/lib/supabase')
    if (!supabase) {
      throw new Error('Missing Supabase environment variables')
    }
    const { data } = await supabase.auth.getSession()
    const token = getAuthTokenOverride() ?? data.session?.access_token

    if (token) {
      init.headers = {
        ...(init.headers ?? {}),
        Authorization: `Bearer ${token}`,
      }
    }
  } catch (_) {
    // no-op
  }

  const response = await fetch(url, init)

  if (!response.ok) {
    let message: string
    try {
      const errorPayload = await response.json()
      message = errorPayload?.message ?? JSON.stringify(errorPayload)
    } catch (_) {
      message = await response.text()
    }

    const err = new Error(message || `Request to ${url} failed with status ${response.status}`) as CorrelatedError
    err.correlationId = correlationId
    err.status = response.status
    throw err
  }

  return parseResponse<T>(response)
}

export const http = {
  get: <T>(path: string, config?: RequestConfig) => request<T>(path, { ...config, method: 'GET' }),
  post: <T>(path: string, body?: unknown, config?: RequestConfig) => request<T>(path, { ...config, method: 'POST', body }),
  patch: <T>(path: string, body?: unknown, config?: RequestConfig) => request<T>(path, { ...config, method: 'PATCH', body }),
  put: <T>(path: string, body?: unknown, config?: RequestConfig) => request<T>(path, { ...config, method: 'PUT', body }),
  delete: <T>(path: string, config?: RequestConfig) => request<T>(path, { ...config, method: 'DELETE' }),
}
