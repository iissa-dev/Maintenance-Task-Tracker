export interface Result<T> {
  isSuccess: boolean;
  data: T;
  message: string;
}

export interface CategoryDto {
  id: number;
  name: string;
}

export interface MaintenanceRequestDto {
  id: number;
  customerName: string;
  categoryName: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed" | "Canceled";
  createdAt: string;
}

export interface RequestDto {
  description: string;
  customerName: string;
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