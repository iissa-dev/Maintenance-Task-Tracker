export interface Result<T = void> {
  isSuccess: boolean;
  data?: T;
  message: string;
}

export interface CategoryDto {
  id: number;
  name: string;
}

export interface ResponseRequestDto {
  id: number;
  description: string;
  status: "Pending" | "InProgress" | "Completed" | "Canceled";
  createdAt: string;
  categoryName: string;
  categoryId: number;
}

export interface RequestDto {
  description: string;
  categoryId: number;
}

export interface CategoryWithRequestCountDto {
  id: number;
  name: string;
  requestCount: number;
}

export interface DashboardStatsDto {
  TotalRequests: number;
  PendingCount: number;
  InProgressCount: number;
  CompletedCount: number;
}

export interface PageResult<T> {
  items: T;
  totalItems: number;
  totalPages: number;
  pageNumber: number;
  pageCount: number;
}

export interface UpdateRequestDto {
  description: string;
  categoryId: number;
  status: number;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  password: string;
  dateOfBairth: string | null;
}

export interface LoginDto {
  userName: string;
  password: string;
}

export interface AuthResponseDto {
  accessToken: string;
  userName: string;
  role: string;
}
// Store in Context 
export interface AuthUser {
  userName: string;
  role: string;
}

export interface UserReponseDto {
  id: number;
  fullName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  role: string;
}

export interface TokenResult {
  accessToken: string;
  refreshToken: string;
  role: string;
  userName: string;
}