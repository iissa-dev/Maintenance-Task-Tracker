import {useEffect} from "react";
import {useForm} from "react-hook-form";
import type {CategoryDto, UpdateRequestDto} from "../../../types";

type FormValues = {
    description: string;
    categoryId: number;
    status: number;
};

export const useRequestForm = (
    isOpen: boolean,
    mode: "Add" | "Edit",
    categories: CategoryDto[],
    data?: UpdateRequestDto,
) => {
    const {register, handleSubmit, reset} = useForm<FormValues>({
        defaultValues: {
            description: "",
            categoryId: 1,
            status: 1,
        },
    });

    useEffect(() => {
        if (!isOpen) return;

        if (mode === "Edit" && data) {


            reset({
                description: data.description,
                categoryId: data.categoryId,
                status: data.status,
            });
        } else {
            reset({
                description: "",
                categoryId: 1,
                status: 1,
            });
        }
    }, [isOpen, mode, data, categories, reset]);

    return {register, handleSubmit};
};
