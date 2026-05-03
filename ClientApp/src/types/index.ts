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
    name: string;
    status: "Pending" | "InProgress" | "Completed" | "Canceled";
    createdAt: string;
    categoryName: string;
    categoryId: number;
    customerName?: string;
}

export interface RequestDto {
    description: string;
    categoryId: number;
    serviceRequestId?: number;
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
    items: T[];
    totalItems: number;
    totalPages: number;
    pageNumber: number;
    pageCount: number;
}

export interface UpdateRequestDto {
    id: number;
    description: string;
    categoryId: number;
    status: number;
}

export interface RegisterDto {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    phoneNumber: string | null;
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

export interface UserResponseDto {
    id: number;
    fullName: string;
    userName: string;
    email: string;
    phoneNumber?: string;
    role: string;
}

export interface TokenResult {
    accessToken: string;
    refreshToken: string;
    role: string;
    userName: string;
}

export interface UpdateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
}

export interface AddUserDto extends UpdateUserDto {
    password: string;
}

export interface UpdateServiceRequestDto {
    id: number;
    name: string;
    description: string;
    price?: number;
    categoryId: number;
}

export interface AddServiceRequestDto {
    name: string;
    description: string;
    price?: number;
    categoryId: number;
}

export interface ServiceRequestResponseDto {
    serviceId: number;
    name: string;
    description: string;
    price?: number;
    categoryDto: CategoryDto;
}
