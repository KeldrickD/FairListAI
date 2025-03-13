interface RequestOptions extends RequestInit {
  body?: any;
}

export async function apiRequest(url: string, options: RequestOptions = {}) {
  const { body, ...restOptions } = options;

  const response = await fetch(url, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...restOptions.headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
} 