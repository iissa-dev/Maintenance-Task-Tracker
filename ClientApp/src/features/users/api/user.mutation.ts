import { PopupType, type PopupTypeValue } from "../../../components/Popup";
import type { AddUserDto, Result, UpdateUserDto } from "../../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../../services/userService";

type Props = {
  onClose?: () => void;
  alert: (
    message: string,
    title: string,
    type: PopupTypeValue,
  ) => Promise<boolean>;
};
const handleResponse = async <T>(
  promise: Promise<Result<T>>,
): Promise<Result<T>> => {
  const res = await promise;
  if (!res.isSuccess) throw new Error(res.message);
  return res;
};

export const useUpdateUser = ({ onClose, alert }: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateUserDto }) =>
      handleResponse(userService.updateUser(id, data)),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onClose?.();
    },

    onError: async (error: Error) => {
      await alert(error.message, "Error", PopupType.WARNING);
    },
  });
};

export const useAddUser = ({ onClose, alert }: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddUserDto) =>
      handleResponse(userService.addNewEmployee(data)),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onClose?.();
    },

    onError: async (error: Error) => {
      await alert(error.message, "Error", PopupType.WARNING);
    },
  });
};

export const useDeleteUser = ({ alert }: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) =>
      handleResponse(userService.deleteUser(id)),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },

    onError: async (error: Error) => {
      await alert(error.message, "Error", PopupType.WARNING);
    },
  });
};
