import { useQuery } from "@tanstack/react-query";
import type {
  AddServiceRequestDto,
  UpdateServiceRequestDto,
} from "../../../types";
import { serviceRequestService } from "../../../services/serviceRequestService";
import { handleResponse } from "../../../utils/handleResponse";
import {
  useGenericMutation,
  type alertType,
} from "../../../utils/mutationFactory";

type serviceProps = {
  pageNumber: number;
  pageSize: number;
  categoryId?: number | null;
};

export const useServices = ({
  pageNumber,
  pageSize,
  categoryId,
}: serviceProps) => {
  const { data, isLoading, isFetching } = useQuery({
    queryFn: () =>
      serviceRequestService.services({ pageNumber, pageSize, categoryId }),
    queryKey: ["services", categoryId, pageNumber],
    staleTime: 1000 * 60 * 60 * 10,
  });

  return {
    services: data?.data?.items ?? [],
    totalPages: data?.data?.totalPages ?? 0,
    isLoading,
    isFetching,
  };
};
export const useAddServiceRequest = (
  { alert }: alertType,
  onClose?: () => void | null,
) => {
  const mutation = useGenericMutation<AddServiceRequestDto, void>(
    (data) => handleResponse(serviceRequestService.addServices(data)),
    ["services"],
    { alert },
    "Service Added Successfully",
    onClose,
  );
  return mutation;
};

export const useUpdateServiceRequest = (
  onClose: () => void,
  { alert }: alertType,
) => {
  const mutation = useGenericMutation<UpdateServiceRequestDto, void>(
    (data) =>
      handleResponse(serviceRequestService.updateService(data.id, data)),
    ["services"],
    { alert },
    "Service Updated Successfully",
    onClose,
  );
  return mutation;
};

export const useDeleteServiceReqeust = ({ alert }: alertType) => {
  const mutation = useGenericMutation<number, void>(
    (data) => handleResponse(serviceRequestService.deleteService(data)),
    ["services"],
    { alert },
    "Service Deleted Successfully",
  );
  return mutation;
};
