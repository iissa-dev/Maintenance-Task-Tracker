import apiClient from "../api/apiClient";
import type {
    AddServiceRequestDto,
    PageResult,
    Result,
    ServiceRequestResponseDto,
    UpdateServiceRequestDto,
} from "../types";

type Param = {
    pageNumber: number;
    pageSize: number;
    categoryId?: number | null;
    searchByName?: string;
};
export const serviceRequestService = {
    services: async ({
                         pageNumber,
                         pageSize,
                         categoryId,
                         searchByName,
                     }: Param): Promise<Result<PageResult<ServiceRequestResponseDto>>> => {
        return apiClient.get("ServiceRequest/Services", {
            params: {
                pageNumber,
                pageSize,
                categoryId,
                searchByName,
            },
        });
    },
    addServices: async (data: AddServiceRequestDto): Promise<Result> => {
        return apiClient.post("ServiceRequest/CreateNewService", data);
    },
    updateService: async (
        id: number,
        data: UpdateServiceRequestDto,
    ): Promise<Result> => {
        return apiClient.put(`ServiceRequest/UpdateService/${id}`, data);
    },
    deleteService: async (id: number): Promise<Result> => {
        return apiClient.delete(`ServiceRequest/DeleteService/${id}`);
    },
};
