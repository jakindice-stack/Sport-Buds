const API_BASE = import.meta.env.VITE_API_BASE

if (!API_BASE) {
  throw new Error('Missing VITE_API_BASE environment variable')
}

const normalizeBase = (base: string) => base.replace(/\/$/, '')
const baseUrl = normalizeBase(API_BASE)

const ensureLeadingSlash = (path: string) => (path.startsWith('/') ? path : `/${path}`)

type RequestConfig = Omit<RequestInit, 'body'> & {
  body?: unknown
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
  const url = path.startsWith('http') ? path : `${baseUrl}${ensureLeadingSlash(path)}`
  const init = buildRequestInit(config)

  try {
    const { supabase } = await import('@/lib/supabase')
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token

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

    throw new Error(message || `Request to ${url} failed with status ${response.status}`)
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
