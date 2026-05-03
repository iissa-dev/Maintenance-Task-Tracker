import apiClient from "../api/apiClient";
import type {
    Result,
    ResponseRequestDto,
    DashboardStatsDto,
    RequestDto,
    PageResult,
    UpdateRequestDto,
} from "../types";

type Props = {
    categoryId?: number | null;
    pageNumber: number;
    pageSize: number;
};

export const requestService = {
    getRecentActivity: async (): Promise<Result<ResponseRequestDto[]>> => {
        return await apiClient.get("Request/recentActivity");
    },
    getDashboardStats: async (): Promise<Result<DashboardStatsDto>> => {
        return await apiClient.get("Request/dashboardStats");
    },
    addNewRequest: async (data: RequestDto): Promise<Result<boolean>> => {
        return await apiClient.post("Request/addNewRequest", data);
    },
    getAll: async ({
                       categoryId,
                       pageNumber,
                       pageSize,
                   }: Props): Promise<Result<PageResult<ResponseRequestDto>>> => {
        const url = `Request/GetAllRequest`;
        return await apiClient.get(url, {
            params: {
                categoryId: categoryId && categoryId > 0 ? categoryId : undefined,
                pageNumber,
                pageSize
            }
        });
    },
    delete: async (id: number): Promise<Result<boolean>> => {
        return await apiClient.delete(`Request/${id}`);
    },
    updateReqeust: async (
        id: number,
        data: UpdateRequestDto,
    ): Promise<Result<boolean>> => {
        console.log(data);
        return await apiClient.put(`Request/${id}`, data);
    },
    assignToEmployee: async (requestId: number, employeeId: number): Promise<Result<boolean>> => {
        return await apiClient.put(`Admin/request/${requestId}/assign/${employeeId}`);
    }
};
