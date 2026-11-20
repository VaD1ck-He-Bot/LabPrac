
export class ApiRequestError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;

function getApiUrl(): string {
  if (!API_URL) {
    throw new Error(
      'Не задан адрес API. Проверь файл .env'
    );
  }

  return API_URL.replace(/\/+$/, '');
}

export async function apiRequest<T>(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);

  headers.set('Authorization', `Bearer ${token}`);

  if (
    options.body &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;

  try {
    response = await fetch(
      `${getApiUrl()}${path}`,
      {
        ...options,
        headers,
      }
    );
  } catch {
    throw new Error(
      'Не удалось подключиться к серверу. Проверь соединение.'
    );
  }

  if (!response.ok) {
    let message = `Ошибка сервера: ${response.status}`;

    try {
      const data = await response.json();

      if (
        data &&
        typeof data.error === 'string'
      ) {
        message = data.error;
      }
    } catch {
    }

    throw new ApiRequestError(
      message,
      response.status
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
