import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Result } from "../types";
import  {type PopupTypeValue, PopupType } from "../types/popup.types";

export type alertType = {
  alert: (
    message: string,
    title: string,
    type: PopupTypeValue,
  ) => Promise<boolean>;
};

export const useGenericMutation = <TData, TResponse>(
  mutationFn: (data: TData) => Promise<Result<TResponse>>,
  queryKey: string[],
  {alert}: alertType,
  onSuccessMessage: string,
  onSuccessCallback?: () => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
      if(onSuccessCallback) onSuccessCallback();
      await alert(onSuccessMessage, "Success", PopupType.INFO);
    },
    onError: async (error: Error) => {
      await alert(
        error.message || "Something went wrong",
        "Error",
        PopupType.DANGER,
      );
    },
  });
};
