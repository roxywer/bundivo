const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('bundivo_token')
}

function clearAuth() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('bundivo_token')
    localStorage.removeItem('bundivo-auth')
    window.location.href = '/login'
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  if (!res.ok) {
    // Handle 401 - token expired or invalid
    if (res.status === 401) {
      clearAuth()
      throw new Error('Session expired. Please sign in again.')
    }
    const error = await res.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || 'Request failed')
  }

  return res.json()
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
