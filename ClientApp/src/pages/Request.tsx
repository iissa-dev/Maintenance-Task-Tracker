import {useCallback, useState} from "react";
import Sidebar from "../layouts/Sidebar";
import "./Request.css";
import HandleRequest from "../features/requests/components/HandleRequest";
import type {UpdateRequestDto} from "../types";
import {usePopup, PopupType} from "../components/Popup";
import {ThreeDot} from "react-loading-indicators";
import Header from "../layouts/Header.tsx";
import RequestCard from "../features/requests/components/RequestCard.tsx";
import {useAssignToEmployee, useDeleteRequest, useRequests} from "../features/requests/api/request.mutations.ts";
import {useUsers} from "../features/users/api/user.mutation.ts";

type FormState =
    | { Mode: "Add"; data: null }
    | { Mode: "Edit"; data: UpdateRequestDto };

const DEFAULT_FORM_STATE: FormState = {Mode: "Add", data: null};

function Request() {
    const [open, setOpen] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
    const {confirm, alert, Modal} = usePopup();
    const assignMutation = useAssignToEmployee(alert);
    const [categoryId, setCategoryId] = useState<number | null>(null);

    const employees = useUsers({PageNumber: 1, PageSize: 100, role: 2});

    const {requests, isLoading, isPlaceholderData, totalPages} = useRequests({pageNumber, pageSize: 6, categoryId})

    const deleteRequest = useDeleteRequest(alert);

    const handleDelete = useCallback(async (id: number) => {
        const ok = await confirm(
            `Are you sure you want to delete request with Id: ${id}?`,
            "Delete",
            PopupType.WARNING,
        );
        if (!ok) return;

        try {
            await deleteRequest.mutateAsync(id);
            await alert("Request deleted successfully.", "Delete", PopupType.INFO);
        } catch (error) {
            await alert(`${error}`, "Delete", PopupType.DANGER);
        }
    }, [confirm, alert, deleteRequest]);

    const handleCloseForm = () => {
        setOpen(false);
        setFormState(DEFAULT_FORM_STATE);
    };

    const goNext = useCallback(() => {
        if (!isPlaceholderData && pageNumber < totalPages) {
            setPageNumber((prev) => prev + 1);
        }
    }, [isPlaceholderData, pageNumber, totalPages]);

    const goPrev = useCallback(() => {
        if (pageNumber > 1) {
            setPageNumber((prev) => prev - 1);
        }
    }, [pageNumber]);

    const handleAssign = useCallback(async (requestId: number, employeeId: number, employeeName: string) => {
        if (employeeId === 0) {
            await alert("Please select an employee first.", "Selection Required", PopupType.WARNING);
            return;
        }

        const ok = await confirm(
            `Do you want to assign this task to (${employeeName})?`,
            "Assign Task",
            PopupType.INFO
        );

        if (!ok) return;

        try {
            await assignMutation.mutateAsync({requestId, employeeId});
            await alert("Task assigned successfully!", "Success", PopupType.INFO);
        } catch (error) {
            console.error(error);
        }
    }, [confirm, alert, assignMutation]);

    const handleCategorySelect = useCallback((catId: number) => {
        setCategoryId(catId);
        setPageNumber(1);
    }, [])
    if (isLoading) {
        return (
            <div className="fixed top-[50%] left-[50%] -translate-[50%]">
                <ThreeDot
                    variant="bounce"
                    color="#239c8c"
                    size="medium"
                    text="LOADING"
                    textColor="#0d8988"
                />
            </div>
        );
    }
    return (
        <div className="flex">
            <Sidebar/>

            <div className="p-8 flex-1 flex flex-col max-w-400 mx-auto w-full">
                <Header title={"Request Management"} subtitle={"Every thing you need to manage Requests"}
                        buttonText={"New Request"}
                        addButton={() => {
                            setOpen(true);
                            setFormState(DEFAULT_FORM_STATE)
                        }}
                />
                <RequestCard requests={requests}
                             onRemoveRequest={handleDelete}
                             onGoNext={goNext}
                             onGoBack={goPrev}
                             employees={employees.users}
                             onAssignTask={handleAssign}
                             onCategoryIdSelect={handleCategorySelect}/>

                <HandleRequest
                    isOpen={open}
                    onClose={handleCloseForm}
                    {...formState}
                />
            </div>

            <Modal/>
        </div>
    );
}

export default Request;
