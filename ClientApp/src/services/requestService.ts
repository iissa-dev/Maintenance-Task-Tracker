import apiClient from "../api/apiClient";
import type {
  Result,
  MaintenanceRequestDto,
  DashboardStatsDto,
  RequestDto,
  PageResult,
  UpdateRequestDto,
} from "../types";

type Props = {
  pageNumber: number;
  pageSize: number;
};

export const requestService = {
  getRecentActivity: async (): Promise<Result<MaintenanceRequestDto[]>> => {
    return await apiClient.get("Request/recentActivity");
  },
  getDashboardStats: async (): Promise<Result<DashboardStatsDto>> => {
    return await apiClient.get("Request/dashboardStats");
  },
  addNewRequest: async (data: RequestDto): Promise<Result<boolean>> => {
    return await apiClient.post("Request/addNewRequest", data);
  },
  getAll: async ({
    pageNumber,
    pageSize,
  }: Props): Promise<PageResult<MaintenanceRequestDto[]>> => {
    const url = `Request/GetAllRequest?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return await apiClient.get(url);
  },
  delete: async (id: number): Promise<Result<boolean>> => {
    return await apiClient.delete(`Request/${id}`);
  },
  updateReqeust: async (
    id: number,
    data: UpdateRequestDto,
  ): Promise<Result<boolean>> => {
    return await apiClient.put(`Request/${id}`, data);
  },
};
