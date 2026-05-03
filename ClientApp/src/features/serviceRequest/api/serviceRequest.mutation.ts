import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import type {
    AddServiceRequestDto,
    Result,
    UpdateServiceRequestDto,
} from "../../../types";
import {serviceRequestService} from "../../../services/serviceRequestService";
import {PopupType, type PopupTypeValue} from "../../../components/Popup";

const handleResponse = async <T>(
    promise: Promise<Result<T>>,
): Promise<Result<T>> => {
    const res = await promise;
    if (!res.isSuccess) throw new Error(res.message);
    return res;
};

type serviceProps =
    {
        pageNumber: number;
        pageSize: number;
        categoryId?: number | null;
    }

export const useServices = ({pageNumber, pageSize, categoryId}: serviceProps) => {
    const {data, isLoading, isFetching} = useQuery({
        queryFn: () =>
            serviceRequestService.services({pageNumber, pageSize, categoryId}),
        queryKey: ["services", categoryId, pageNumber],
        staleTime: 1000 * 60 * 60 * 10,
    });

    return {
        services: data?.data?.items ?? [],
        totalPages: data?.data?.totalPages ?? 0,
        isLoading,
        isFetching,
    }
}
export const useAddServiceRequest = (
    alert: (
        message: string,
        title: string,
        type: PopupTypeValue,
    ) => Promise<boolean>,
    onClose?: () => void | null,
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AddServiceRequestDto) =>
            handleResponse(serviceRequestService.addServices(data)),

        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["services"]});
            await alert("Service request added successfully", "Success", PopupType.INFO);
            onClose?.();
        },
        onError: async (error: Error) => {
            await alert(error.message, "Error", PopupType.DANGER);
        },
    });
};

export const useUpdateServiceRequest = (
    onClose: () => void,
    alert: (
        message: string,
        title: string,
        type: PopupTypeValue,
    ) => Promise<boolean>,
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateServiceRequestDto) =>
            handleResponse(serviceRequestService.updateService(data.id, data)),

        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["services"]});
            await alert(
                "Service request updated successfully",
                "Success",
                PopupType.INFO,
            );
            onClose();
        },
        onError: async (error: Error) => {
            await alert(error.message, "Error", PopupType.DANGER);
        },
    });
};

export const useDeleteServiceReqeust = (
    alert: (
        message: string,
        title: string,
        type: PopupTypeValue,
    ) => Promise<boolean>,
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
            handleResponse(serviceRequestService.deleteService(id)),

        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["services"]});
            await alert(
                "Service request deleted successfully",
                "Success",
                PopupType.INFO,
            );
        },
        onError: async (error: Error) => {
            await alert(error.message, "Error", PopupType.DANGER);
        },
    });
};
