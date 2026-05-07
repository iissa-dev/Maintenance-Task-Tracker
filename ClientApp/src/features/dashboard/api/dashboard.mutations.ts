import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { Result } from "../../../types";
import { requestService } from "../../../services/requestService";
import { categoryService } from "../../../services/categoryService";

const handleResponse = async <T>(promise: Promise<Result<T>>) => {
  const res = await promise;
  if (!res.isSuccess) throw new Error(res.message);
  return res;
};

export const useRecentRequest = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["recentRequest"],
    queryFn: () => handleResponse(requestService.getRecentActivity()),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData
  });

  return {
    recentRequest: data?.data ?? [],
    isLoading,
  };
};

export const useDashboardStats = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: () => handleResponse(requestService.getDashboardStats()),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData
  });

  return {
    dashboardStats: data?.data ?? [],
    isLoading,
  };
};


export const useTopThreeCategories = () => {
  const {data} = useQuery({
    queryKey: ["topThreeCategories"],
    queryFn: () => handleResponse(categoryService.getTopThreeCategories()),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData
  })

  return {categories: data?.data ?? []} 
}
