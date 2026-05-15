import apiClient from "../api/apiClient";
import type {
  Result,
  CategoryDto,
  CategoryWithRequestCountDto,
} from "../types";

export const categoryService = {
  getAll: async (): Promise<Result<CategoryDto[]>> => {
    return await apiClient.get("Category/GetAllCategories");
  },
  getTopThreeCategories: async (): Promise<
    Result<CategoryWithRequestCountDto[]>
  > => {
    return await apiClient.get("Category/GetTopThreeCategories");
  },
  addNewCategory: async (name: string): Promise<Result<CategoryDto>> => {
    return await apiClient.post("Category/AddCategory", {name: name});
  },
  deleteCategory: async (categoryId: number): Promise<Result<boolean>> => {
    return await apiClient.delete(`Category/DeleteCategory/${categoryId}`)
  },
  updateCategory: async (data: CategoryDto): Promise<Result> => {
    return await apiClient.put("Category/UpdateCategory", data)
  }
};
