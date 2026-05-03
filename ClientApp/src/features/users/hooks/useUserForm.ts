import {useEffect} from "react";
import {useForm} from "react-hook-form";
import type {UpdateUserDto} from "../../../types";

type FormValue = {
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    password?: string;
};

/**
 * Custom hook to manage the user form state and behavior for both adding and editing users.
 * @param isOpen - A boolean indicating whether the form is open or not.
 * @param mode - The mode of the form ("Add" or "Edit").
 * @param data - The data to populate the form with when in "Edit" mode.
 * @returns An object containing the form management functions.
 */
export const useUserForm = (
    isOpen: boolean,
    mode: "Add" | "Edit",
    data?: UpdateUserDto,
) => {
    const {register, handleSubmit, reset} = useForm<FormValue>({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            userName: "",
            password: "",
        },
    });

    // Reset form values when opening the form or when data changes
    useEffect(() => {
        if (!isOpen) return;
        if (mode === "Edit" && data) {
            reset({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                userName: data.userName,
            });
        } else {
            reset({
                firstName: "",
                lastName: "",
                email: "",
                userName: "",
                password: "",
            });
        }
    }, [isOpen, mode, data, reset]);

    return {register, handleSubmit};
};
