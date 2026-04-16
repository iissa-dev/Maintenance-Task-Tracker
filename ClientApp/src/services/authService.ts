import apiClient from "../api/apiClient";

import type {
  AuthResponseDto,
  LoginDto,
  RegisterDto,
  Result,
  TokenResult,
} from "../types/index";

export const authService = {
  Register: async (data: RegisterDto): Promise<Result<boolean>> => {
    return await apiClient.post("/Auth/register", data);
  },
  Login: async (data: LoginDto): Promise<Result<TokenResult>> => {
    return await apiClient.post("/Auth/login", data);
  },
  Refresh: async (): Promise<AuthResponseDto> => {
    return await apiClient.post("/Auth/refresh", {}, {withCredentials: true});
  },
  Logout: async (): Promise<Result<boolean>> => {
    return await apiClient.put("/Auth/logout");
  },
};


