import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.DEV ? "https://localhost:7166/api" : "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default apiClient;
