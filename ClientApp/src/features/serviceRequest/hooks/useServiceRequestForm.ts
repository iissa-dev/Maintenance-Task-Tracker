import { useForm } from "react-hook-form";
import type { CategoryDto, ServiceRequestResponseDto } from "../../../types";
import { useEffect } from "react";

type formValues = {
  id?: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
};

export const useServiceRequestForm = (
  isOpen: boolean,
  mode: "Add" | "Edit",
  categories: CategoryDto[],
  data?: ServiceRequestResponseDto,
) => {
  const { register, handleSubmit, reset } = useForm<formValues>({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      categoryId: 3,
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "Edit" && data) {
      const categoryId =
        categories.find((c) => c.name === data.categoryDto.name)?.id ?? 1;

      reset({
        id: data.serviceId,
        name: data?.name,
        description: data?.description,
        price: data?.price ?? 0,
        categoryId: categoryId ?? 3,
      });
    } else {
      reset({
        name: "",
        description: "",
        price: 0,
        categoryId: 3,
      });
    }
  }, [isOpen, mode, categories, data, reset]);

  return { register, handleSubmit };
};
