import {usePopup} from "../../../components/Popup";
import {useRequestForm} from "../hooks/useRequestForm";
import {useAddRequest, useEditRequest} from "../api/request.mutations";
import type {UpdateRequestDto} from "../../../types";
import {RequestStatus} from "../utils/request.constants";
import useCategory from "../../../hooks/useCategory.ts";

type BaseProps = {
    isOpen: boolean;
    onClose: () => void;
    Id?: number
};

type Props =
    | ({ Mode: "Add"; data?: null } & BaseProps)
    | ({ Mode: "Edit"; data: UpdateRequestDto; } & BaseProps);

function HandleRequest({isOpen, onClose, Mode, data, Id}: Props) {
    const {alert, Modal} = usePopup();

    const categories = useCategory() ?? [];

    const addMutation = useAddRequest(alert, onClose);
    const editMutation = useEditRequest(onClose, alert);

    const {register, handleSubmit} = useRequestForm(
        isOpen,
        Mode,
        categories,
        data ?? undefined,
    );

    const onSubmit = handleSubmit((formData) => {
        if (Mode === "Add") {
            addMutation.mutate(formData);
        } else {
            editMutation.mutate({
                id: Id ?? 0,
                description: formData.description,
                categoryId: formData.categoryId,
                status: formData.status,
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

                    <label htmlFor="categoryId" className="text-sm font-medium text-sub mb-1.5 ml-1">Category</label>
                    <select
                        id="categoryId"
                        className="px-4 py-2.5 bg-muted/30 border border-border outline-none rounded-xl mb-5 focus:border-primary/50 transition-all appearance-none"
                        {...register("categoryId", {valueAsNumber: true})}
                    >
                        {categories.map((c) => (
                            <option className="bg-card" key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>

                    {Mode === "Edit" && (
                        <>
                            <label htmlFor="status" className="text-sm font-medium text-sub mb-1.5 ml-1">Status</label>
                            <select
                                id="status"
                                className="px-4 py-2.5 bg-muted/30 border border-border outline-none rounded-xl mb-6 focus:border-primary/50 transition-all"
                                {...register("status", {valueAsNumber: true})}
                            >
                                {Object.entries(RequestStatus).map(([label, value]) => (
                                    <option className="bg-card" key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </>
                    )}

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
