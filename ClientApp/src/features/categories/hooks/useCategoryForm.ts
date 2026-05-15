import { useForm } from "react-hook-form";
import { useEffect } from "react";
import type { CategoryDto } from "../../../types";

type formValues = {
  category: CategoryDto;
};

type Params = {
  isOpen: boolean;
  mode: "Add" | "Edit";
  data?: CategoryDto | null;
};
export const useCategoryForm = ({ isOpen, mode, data }: Params) => {
  const { register, handleSubmit, reset } = useForm<formValues>({
    defaultValues: {
      category: {
        name: "",
        id: 0,
      },
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "Edit" && data) {
      reset({
        category: {
          name: data.name,
          id: data.id,
        },
      });
    } else {
      reset({
        category: {
          name: "",
          id: 0,
        },
      });
    }
  }, [isOpen, mode, data, reset]);

  return { register, handleSubmit };
};
