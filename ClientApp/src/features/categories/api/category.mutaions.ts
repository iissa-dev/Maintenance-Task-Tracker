import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../../../services/categoryService";
import type { CategoryDto } from "../../../types";
import { useGenericMutation, type alertType } from "../../../utils/mutationFactory";
import { handleResponse } from "../../../utils/handleResponse";


export const useCategory = () => {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getAll,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
    select: (res) => res.data ?? [],
  });

  return categories;
};

export const useAddCategory = (
  {alert} : alertType,
  onClose? : () => void | null
) => {
  const mutation = useGenericMutation<string, CategoryDto>(
    (data) => handleResponse(categoryService.addNewCategory(data)),
    ["catetgories"],
    {alert},
    "Category added successfully",
    onClose,
  );
  return mutation;
};

export const useDeleteCategory = (
  {alert}: alertType,
) => {
  const mutation = useGenericMutation<number, boolean>(
    (data) => handleResponse(categoryService.deleteCategory(data)),
    ["categories"],
    {alert},
    "Category Deleted Successfully",
  );

  return mutation;
};

export const useUpdateCategory = (
  {alert}: alertType,
  onClose?: () => void | null,
) => {
  const mutation = useGenericMutation<CategoryDto, void>(
    (data) => handleResponse(categoryService.updateCategory(data)),
    ["categories"],
    {alert},
    "Category Updated Successfully",
    onClose,
  );

  return mutation;
};
