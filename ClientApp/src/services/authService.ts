import apiClient from "../api/apiClient";

import type {
  AuthResponseDto,
  LoginDto,
  RegisterDto,
  Result,
} from "../types/index";

export const authService = {
  Register: async (data: RegisterDto): Promise<Result<boolean>> => {
    return await apiClient.post("/Auth/register", data);
  },
  Login: async (data: LoginDto): Promise<AuthResponseDto> => {
    return await apiClient.post("/Auth/login", data);
  },
  Refresh: async (): Promise<AuthResponseDto> => {
    return await apiClient.post("/Auth/refresh");
  },
  Logout: async (): Promise<Result<boolean>> => {
    return await apiClient.put("/Auth/logout");
  },
};
