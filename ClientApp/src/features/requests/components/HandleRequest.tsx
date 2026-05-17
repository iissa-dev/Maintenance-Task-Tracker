import { usePopup} from "../../../components/Popup";
import {useRequestForm} from "../hooks/useRequestForm";
import {useAddRequest, useEditRequest} from "../api/request.mutations";
import type { UpdateRequestDto} from "../../../types";
import { PopupType } from "../../../types/popup.types";

type BaseProps = {
    isOpen: boolean;
    onClose: () => void;
    serviceId?: number;
    categoryId?: number;
};

type Props =
    | ({ Mode: "Add"; data?: null } & BaseProps)
    | ({ Mode: "Edit"; data: UpdateRequestDto; } & BaseProps);

function HandleRequest({isOpen, onClose, Mode, data, categoryId, serviceId}: Props) {
    const {confirm, alert, Modal} = usePopup();

    const addMutation = useAddRequest({alert}, onClose);
    const editMutation = useEditRequest(onClose, {alert});

    const {register, handleSubmit} = useRequestForm(
        isOpen,
        Mode,
        data,
    );

    const onSubmit = handleSubmit(async (formData) => {

        const ok = await confirm(
            Mode === "Add" ? "Are you sure you want to request this service?" : "Are you sure you want to save changes?",
            Mode === "Add" ? "Confirm Request" : "Confirm Changes",
            PopupType.INFO
        );

        if (!ok) return;

        if (formData.serviceRequestId && formData.serviceRequestId === 0) {
            return;
        }

        const finalData = {
            ...formData,
            serviceRequestId: serviceId ?? 0,
            categoryId: categoryId ?? 0,
        };

        if (Mode === "Add") {
          await  addMutation.mutateAsync(finalData);
        } else {
           await editMutation.mutateAsync({
                id: serviceId ?? 0,
                description: finalData.description,
                categoryId: finalData.categoryId,

            });
        }
    });

    if (!isOpen) return null;

    const isPending = addMutation.isPending || editMutation.isPending;

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" onClick={onClose}/>

            {/* Modal Content */}
            <div
                className="fixed w-[90%] max-w-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-1000 bg-card border border-border p-8 rounded-2xl shadow-2xl">
                <h1 className="text-2xl font-bold text-main mb-6">
                    {Mode === "Edit" ? "Edit Request" : "Create New Request"}
                </h1>

                <form className="flex flex-col" onSubmit={onSubmit}>
                    <label htmlFor="description"
                           className="text-sm font-medium text-sub mb-1.5 ml-1">Description</label>
                    <input
                        {...register("description", {required: true})}
                        id="description"
                        placeholder="Describe the issue..."
                        className="px-4 py-2.5 bg-muted/30 border border-border outline-none rounded-xl mb-5 focus:border-primary/50 transition-all"
                    />


                    <div className="flex gap-3 justify-end mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-ghost border-none"
                        >
                            Cancel
                        </button>
                        <button
                            className="btn-primary min-w-30"
                            disabled={isPending}
                        >
                            {isPending ? "Processing..." : Mode === "Add" ? "Create Request" : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
            <Modal/>
        </>
    );
}

export default HandleRequest;
