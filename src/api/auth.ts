export interface User {
    id: string;
    login: string;
    name: string;
}

export interface LoginCredentials {
    login: string;
    password: string;
}

interface LoginResponse {
    accessToken: string;
    expiresIn: number;
    user: User;
}

interface CurrentUserResponse {
    user: User;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;

function getApiUrl() {
    if (!API_URL) {
        throw new Error(
            'Не задан адрес API. Проверь файл .env'
        );
    }

    return API_URL.replace(/\/+$/, '');
}

export class ApiError extends Error {
    constructor(
        message: string,
        public status: number
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

async function getErrorMessage(
    response: Response
): Promise<string> {
    try {
        const data = await response.json();

        if (
            data &&
            typeof data.error === 'string'
        ) {
            return data.error;
        }
    } catch {
    }

    return `Ошибка сервера: ${response.status}`;
}

export async function signIn(
    credentials: LoginCredentials
): Promise<LoginResponse> {
    const response = await fetch(
        `${getApiUrl()}/auth/login`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        }
    );

    if (!response.ok) {
        throw new ApiError(
            await getErrorMessage(response),
            response.status
        );
    }

    const data: LoginResponse =
        await response.json();

    if (
        !data.accessToken ||
        !data.user ||
        !data.user.id
    ) {
        throw new Error(
            'Сервер вернул некорректные данные входа.'
        );
    }

    return data;
}

export async function getCurrentUser(
    token: string
): Promise<User> {
    const response = await fetch(
        `${getApiUrl()}/auth/me`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new ApiError(
            await getErrorMessage(response),
            response.status
        );
    }

    const data: CurrentUserResponse =
        await response.json();

    if (!data.user || !data.user.id) {
        throw new Error(
            'Сервер не вернул данные пользователя.'
        );
    }

    return data.user;
}