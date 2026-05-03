import {keepPreviousData, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {requestService} from "../../../services/requestService";
import type {
    RequestDto,
    Result,
    UpdateRequestDto,
} from "../../../types";
import {PopupType, type PopupTypeValue} from "../../../components/Popup";

const handleResponse = async <T>(
    promise: Promise<Result<T>>,
): Promise<Result<T>> => {
    const res = await promise;
    if (!res.isSuccess) throw new Error(res.message);
    return res;
};

type requestProps =
    {
        pageNumber: number;
        pageSize: number;
        categoryId?: number | null;
    }
export const useRequests = ({pageNumber, pageSize, categoryId}: requestProps) => {
    const {data, isLoading, isPlaceholderData} = useQuery({
        queryKey: ["requests", pageNumber, categoryId],
        queryFn: () =>
            requestService.getAll({
                categoryId: categoryId === 0 ? null : categoryId,
                pageNumber,
                pageSize
            }),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 60 * 5,
    });

    return {
        requests: data?.data?.items ?? [],
        isLoading,
        isPlaceholderData,
        totalPages: data?.data?.totalPages ?? 0,
    }
}

export const useAddRequest = (
    alert: (
        message: string,
        title: string,
        type: PopupTypeValue,
        onClose?: () => void | null,
    ) => Promise<boolean>,
    onClose?: () => void,
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: RequestDto) =>
            handleResponse(requestService.addNewRequest(data)),

        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["requests"]});
            onClose?.();
        },

        onError: async (error: Error) => {
            await alert(error.message, "Error", PopupType.WARNING);
        },
    });
};

export const useEditRequest = (
    onClose: () => void,
    alert: (
        message: string,
        title: string,
        type: PopupTypeValue,
    ) => Promise<boolean>,
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateRequestDto) =>
            handleResponse(requestService.updateReqeust(data.id, data)),

        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["requests"]});
            onClose();
        },

        onError: async (error: Error) => {
            await alert(error.message, "Error", PopupType.WARNING);
        },
    });
};

export const useAssignToEmployee = (
    alert: (
        message: string,
        title: string,
        type: PopupTypeValue,
    ) => Promise<boolean>,
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({requestId, employeeId}: { requestId: number, employeeId: number }) =>
            handleResponse(requestService.assignToEmployee(requestId, employeeId))
        ,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["requests"]});
        },
        onError: async (error: Error) => {
            await alert(error.message, "Assignment Error", PopupType.WARNING);
        },
    })
};

export const useDeleteRequest = (
    alert: (
        message: string,
        title: string,
        type: PopupTypeValue,
    ) => Promise<boolean>,
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const res = await requestService.delete(id);
            if (!res.isSuccess) throw new Error(res.message);
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["requests"]});
        },
        onError: async (error: Error) => {
            await alert(error.message, "Error", PopupType.WARNING);
        }
    });
    
}