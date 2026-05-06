import axios from "axios";
import type {AuthResponseDto} from "../types";
import dayjs from "dayjs";
import {jwtDecode} from "jwt-decode";

const baseURL: string = "http://localhost:5143/api";
let refreshPromise: Promise<AuthResponseDto> | null = null;

const apiClient = axios.create({
    baseURL,
    withCredentials: true,
});

apiClient.interceptors.request.use(async (req) => {
    const stored = localStorage.getItem("authToken");

    if (!stored) return req;

    let authToken: AuthResponseDto;

    try {
        authToken = JSON.parse(stored);
    } catch {
        localStorage.removeItem("authToken");
        return req;
    }

    if (!authToken.accessToken) return req;

    const decoded: { exp?: number } = jwtDecode(authToken.accessToken);

    const isExpired = dayjs().isAfter(dayjs.unix(decoded.exp ?? 0));

    if (!isExpired) {
        req.headers.Authorization = `Bearer ${authToken.accessToken}`;
        return req;
    }

    // Refresh Logic

    if (!refreshPromise) {
        refreshPromise = axios
            .post<AuthResponseDto>(
                `${baseURL}/Auth/refresh`,
                {},
                {withCredentials: true},
            )
            .then((res) => {
                localStorage.setItem("authToken", JSON.stringify(res.data));
                return res.data;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }

    const newToken = await refreshPromise;

    req.headers.Authorization = `Bearer ${newToken.accessToken}`;
    return req;
});

apiClient.interceptors.response.use(
    (response) => response.data,

    async (error) => {
        // Network error
        if (!error.response) {
            return Promise.resolve({
                isSuccess: false,
                message: "Network error. Please check your connection.",
            });
        }

        // Validation / business errors
        if (error.response.status !== 401) {
            const data = error.response.data;

            if (data?.errors) {
                return Promise.resolve({
                    isSuccess: false,
                    message: Object.values(data.errors).flat().join(", "),
                });
            }

            return Promise.resolve(data);
        }

        return Promise.reject(error);
    },
);

export default apiClient;
