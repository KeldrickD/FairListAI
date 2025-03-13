export type ApiRequestOptions = {
  method?: string
  headers?: Record<string, string>
  body?: string
}

export async function apiRequest(
  endpoint: string,
  options: ApiRequestOptions = {}
) {
  const { method = 'GET', headers = {}, body } = options

  const response = await fetch(endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body,
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
} 