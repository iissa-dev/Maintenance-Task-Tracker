import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type {  UpdateRequestDto } from "../../../types";

type FormValues = {
    serviceRequestId: number;
    description: string;
    categoryId: number;
};

export const useRequestForm = <M extends "Add" | "Edit">(
    isOpen: boolean,
    mode: M,
    data?: null | UpdateRequestDto | undefined,
    serviceId?: number,
    categoryId?: number
) => {
    const { register, handleSubmit, reset } = useForm<FormValues>({
        defaultValues: {
            description: "",
            categoryId: 0,
            serviceRequestId: 0,
        },
    });

    useEffect(() => {
        if (!isOpen) return;

        if (mode === "Edit" && data) {

            const editData = data as UpdateRequestDto;

            reset({
                description: editData.description,
                categoryId: editData.categoryId,
                serviceRequestId: editData.id,
            });
        } else {
            // Add
            reset({

                description:  "",
                categoryId: categoryId || 0,
                serviceRequestId: serviceId || 0,
            });
        }
    }, [isOpen, mode, data, reset, serviceId, categoryId]);

    return { register, handleSubmit, };
};