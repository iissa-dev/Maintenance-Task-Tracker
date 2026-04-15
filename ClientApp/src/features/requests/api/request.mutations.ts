import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestService } from "../../../services/requestService";
import type {
  RequestDto,
  Result,
  UpdateRequestDto,
} from "../../../types/index";
import { PopupType, type PopupTypeValue } from "../../../components/Popup";

const handleResponse = async <T>(
  promise: Promise<Result<T>>,
): Promise<Result<T>> => {
  const res = await promise;
  if (!res.isSuccess) throw new Error(res.message);
  return res;
};

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
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      onClose?.();
    },

    onError: async (error: Error) => {
      await alert(error.message, "Error", PopupType.WARNING);
    },
  });
};

export const useEditRequest = (
  id: number,
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
      handleResponse(requestService.updateReqeust(id, data)),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      onClose();
    },

    onError: async (error: Error) => {
      await alert(error.message, "Error", PopupType.WARNING);
    },
  });
};
