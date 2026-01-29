import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
  verified?: Record<string, unknown>;
  role?: string;
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    const url = config.url || "";
    const isAuthRoute =
      url.includes("/auth/login") || url.includes("/auth/sign-up");
    if (accessToken && !isAuthRoute) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
