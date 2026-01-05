import axios from 'axios';

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

export default apiClient;