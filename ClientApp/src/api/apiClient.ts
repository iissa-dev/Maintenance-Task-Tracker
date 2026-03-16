import axios from "axios";
import { getToken, setToken } from "./tokenRef";
import type { AuthResponseDto, Result } from "../types";

const apiClient = axios.create({
  baseURL: import.meta.env.DEV ? "http://localhost:5049/api" : "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response.data,

  async (error) => {
    const originalRequest = error.config;

    // Network error
    if (!error.response) {
      return Promise.resolve<Result>({
        isSuccess: false,
        message: "Network error. Please check your connection.",
      });
    }

    // Business errors + ASP.NET Model Validation
    if (error.response.status !== 401) {
      const data = error.response.data;
      if (data?.errors) {
        return Promise.resolve<Result>({
          isSuccess: false,
          message: Object.values(data.errors as Record<string, string[]>)
            .flat()
            .join(", "),
        });
      }
      return Promise.resolve<Result>(data);
    }

    // 401 — refresh token
    if (originalRequest._retry || originalRequest.url?.includes("Auth/login")) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      });
    }

    isRefreshing = true;
    originalRequest._retry = true;

    try {
      const res: AuthResponseDto = await apiClient.post("Auth/refresh");
      setToken(res.accessToken);
      processQueue(null, res.accessToken);
      originalRequest.headers.Authorization = `Bearer ${res.accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      setToken(null);
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;
