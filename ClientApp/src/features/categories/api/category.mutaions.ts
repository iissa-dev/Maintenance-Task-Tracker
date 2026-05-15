import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../../../services/categoryService";
import type { CategoryDto, Result } from "../../../types";
import { PopupType, type PopupTypeValue } from "../../../components/Popup";

const handleResponse = async <T>(promise: Promise<Result<T>>) => {
  const res = await promise;
  if (!res.isSuccess) throw new Error(res?.message);
  return res;
};

export const useCategory = () => {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getAll,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
    select: (res) => res.data ?? [],
  });

  return categories;
};

export const useAddCategory = (
  alert: (
    message: string,
    title: string,
    type: PopupTypeValue,
  ) => Promise<boolean>,
  onClose?: () => void | null,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["categories"],
    mutationFn: (name: string) =>
      handleResponse(categoryService.addNewCategory(name)),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      await alert("Category added successfully", "Success", PopupType.INFO);
      onClose?.();
    },
    onError: async (error: Error) => {
      await alert(error.message, "Error", PopupType.DANGER);
    },
  });
};

export const useDeleteCategory = (
  alert: (
    message: string,
    title: string,
    type: PopupTypeValue,
  ) => Promise<boolean>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (categoryId: number) =>
      handleResponse(categoryService.deleteCategory(categoryId)),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      await alert("Category Deleted successfully", "Success", PopupType.INFO);
    },
    onError: async (error: Error) => {
      await alert(error.message, "Error", PopupType.DANGER);
    },
  });
};

export const useUpdateCategory = (
  alert: (
    message: string,
    title: string,
    type: PopupTypeValue,
  ) => Promise<boolean>,
  onClose?: () => void | null,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryDto) =>
      handleResponse(categoryService.updateCategory(data)),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      await alert("Category updated successfully", "Success", PopupType.INFO);
      onClose?.();
    },
    onError: async (error: Error) => {
      await alert(error.message, "Error", PopupType.DANGER);
    },
  });
};
