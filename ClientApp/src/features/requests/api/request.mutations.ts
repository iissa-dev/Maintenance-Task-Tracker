import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { requestService } from "../../../services/requestService";
import type { RequestDto, UpdateRequestDto } from "../../../types";
import {
  useGenericMutation,
  type alertType,
} from "../../../utils/mutationFactory";
import { handleResponse } from "../../../utils/handleResponse";

type requestProps = {
  pageNumber: number;
  pageSize: number;
  categoryId?: number | null;
};

const arrayOfkeys = ["requests", "recentRequest","dashboardStats" ]
export const useRequests = ({
  pageNumber,
  pageSize,
  categoryId,
}: requestProps) => {
  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ["requests", pageNumber, categoryId],
    queryFn: () =>
      requestService.getAll({
        categoryId: categoryId === 0 ? null : categoryId,
        pageNumber,
        pageSize,
      }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 60 * 5,
  });

  return {
    requests: data?.data?.items ?? [],
    isLoading,
    isPlaceholderData,
    totalPages: data?.data?.totalPages ?? 0,
  };
};

export const useAddRequest = ({ alert }: alertType, onClose?: () => void) => {
  const mutation = useGenericMutation<RequestDto, boolean>(
    (data) => handleResponse(requestService.addNewRequest(data)),
    [...arrayOfkeys, "topThreeCategories"],
    { alert },
    "Request Added Successfully",
    onClose,
  );
  return mutation;
};

export const useEditRequest = (onClose: () => void, { alert }: alertType) => {
  const mutation = useGenericMutation<UpdateRequestDto, boolean>(
    (data) => handleResponse(requestService.updateRequest(data.id, data)),
    ["requests"],
    { alert },
    "Reqeust Updated Successfully",
    onClose,
  );
  return mutation;
};

export const useAssignToEmployee = ({ alert }: alertType) => {
  const mutation = useGenericMutation<
    { requestId: number; employeeId: number },
    boolean
  >(
    (data) =>
      handleResponse(
        requestService.assignToEmployee(data.requestId, data.employeeId),
      ),
   arrayOfkeys,
    { alert },
    "Request Assigned Successfully",
  );
  return mutation;
};

export const useDeleteRequest = ({ alert }: alertType) => {
  const mutation = useGenericMutation<number, boolean>(
    (data) => handleResponse(requestService.delete(data)),
    arrayOfkeys,
    { alert },
    "Request Deleted Successfully",
  );
  return mutation;
};

export const useUpdateStatusRequest = ({ alert }: alertType) => {
  const mutation = useGenericMutation<number, boolean>(
    (data) => handleResponse(requestService.updateStatusRequest(data)),
    arrayOfkeys,
    { alert },
    "Update Status Request Successfully",
  );
  return mutation;
};
