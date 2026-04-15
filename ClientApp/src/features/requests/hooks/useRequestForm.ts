import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { CategoryDto, ResponseRequestDto } from "../../../types";
import { RequestStatus } from "../utils/request.constants";

type FormValues = {
  description: string;
  categoryId: number;
  status: number;
};

export const useRequestForm = (
  isOpen: boolean,
  mode: "Add" | "Edit",
  categories: CategoryDto[],
  data?: ResponseRequestDto,
) => {
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      description: "",
      categoryId: 1,
      status: 1,
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "Edit" && data) {
      const categoryId =
        categories.find((c) => c.name === data.categoryName)?.id ?? 1;

      reset({
        description: data.description,
        categoryId,
        status: RequestStatus[data.status as keyof typeof RequestStatus],
      });
    } else {
      reset({
        description: "",
        categoryId: 1,
        status: 1,
      });
    }
  }, [isOpen, mode, data, categories, reset]);

  return { register, handleSubmit };
};
