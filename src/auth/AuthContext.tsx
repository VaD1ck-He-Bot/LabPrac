
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import {
  signIn as signInApi,
  getCurrentUser,
  type User,
  type LoginCredentials,
  ApiError,
} from '../api/auth';

import {
  saveToken,
  readToken,
  removeToken,
} from './authStorage';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (
    credentials: LoginCredentials
  ) => Promise<void>;
  signOut: () => Promise<void>;
  authorizedFetch: (
    url: string,
    options?: RequestInit
  ) => Promise<Response>;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  const [accessToken, setAccessToken] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      try {
        const token = await readToken();

        if (!token) {
          return;
        }

        const currentUser = await getCurrentUser(token);

        if (cancelled) {
          return;
        }

        setAccessToken(token);
        setUser(currentUser);
      } catch (error) {
        if (
          error instanceof ApiError &&
          error.status === 401
        ) {
          await removeToken();
        }

        // При сетевой ошибке токен не удаляем.
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = async (
    credentials: LoginCredentials
  ) => {
    const result = await signInApi(credentials);

    await saveToken(result.accessToken);

    setAccessToken(result.accessToken);
    setUser(result.user);
  };

  const signOut = async () => {
    try {
      await removeToken();
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  };

  const authorizedFetch = async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    if (!accessToken) {
      throw new Error('Необходимо войти в аккаунт.');
    }

    const headers = new Headers(options.headers);

    headers.set(
      'Authorization',
      `Bearer ${accessToken}`
    );

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      await signOut();
    }

    return response;
  };

  const value: AuthContextType = {
    user,
    accessToken,
    isLoading,
    isAuthenticated:
      user !== null && accessToken !== null,
    signIn,
    signOut,
    authorizedFetch,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    );
  }

  return context;
}
