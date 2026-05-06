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
};
  