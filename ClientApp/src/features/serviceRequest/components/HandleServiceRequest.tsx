import {usePopup} from "../../../components/Popup";
import type {
    AddServiceRequestDto,
    ServiceRequestResponseDto,
    UpdateServiceRequestDto,
} from "../../../types";
import {
    useAddServiceRequest,
    useUpdateServiceRequest,
} from "../api/serviceRequest.mutation";
import {useServiceRequestForm} from "../hooks/useServiceRequestForm";
import {INPUTS} from "../utils/serviceRequest.constants";
import useCategory from "../../../hooks/useCategory.ts";

type BaseProps = {
    isOpen: boolean;
    onClose: () => void;
};

type Props =
    | ({ Mode: "Add"; data?: null } & BaseProps)
    | ({ Mode: "Edit"; data: ServiceRequestResponseDto } & BaseProps);

const HandleServiceRequest = ({isOpen, onClose, Mode, data}: Props) => {
    const {alert, Modal} = usePopup();


    const categories = useCategory() ?? [];

    const addMutation = useAddServiceRequest(alert, onClose);
    const editMutation = useUpdateServiceRequest(onClose, alert);

    const {register, handleSubmit} = useServiceRequestForm(
        isOpen,
        Mode,
        categories,
        data ?? undefined,
    );

    const onSubmit = handleSubmit((formData) => {
        if (Mode === "Add") {
            addMutation.mutate(formData as AddServiceRequestDto);
        } else {
            editMutation.mutate(formData as UpdateServiceRequestDto);
        }
    });

    if (!isOpen) return null;

    const isPending = addMutation.isPending || editMutation.isPending;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-999 bg-background/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div
                className="fixed w-[90%] max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-1000 
                           bg-card border border-border p-8 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200"
            >
                <h1 className="text-2xl font-bold text-main mb-8 text-center">
                    {Mode === "Edit" ? "Edit Service Request" : "New Service Request"}
                </h1>

                <form onSubmit={onSubmit} className="flex flex-col">
                    <div className="flex flex-col gap-1.5 mb-6">
                        {INPUTS.map((input) => (
                            <div key={input.id} className="flex flex-col gap-1.5 mb-4">
                                <label className="text-[11px] font-black uppercase tracking-widest text-sub ml-1">
                                    {input.placeholder}
                                </label>
                                <input
                                    {...register(input.name, {
                                        required: true,
                                        valueAsNumber: input.type === "number",
                                    })}
                                    type={input.type}
                                    placeholder={`Enter ${input.placeholder.toLowerCase()}...`}
                                    className="px-4 py-2.5 bg-muted/30 border border-border outline-none rounded-xl text-sm
                                               focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all
                                               placeholder:text-sub/30 text-foreground"
                                />
                            </div>
                        ))}

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-black uppercase tracking-widest text-sub ml-1">
                                Category
                            </label>
                            <select
                                {...register("categoryId", {required: true, valueAsNumber: true})}
                                className="px-4 py-2.5 bg-muted/30 border border-border outline-none rounded-xl text-sm
                                           focus:border-primary/50 transition-all text-foreground appearance-none cursor-pointer"
                            >
                                <option value="" disabled className="bg-card text-sub">Select Category</option>
                                {categories?.map((c) => (
                                    <option
                                        className="bg-card text-foreground"
                                        key={c.id}
                                        value={c.id}
                                    >
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t border-border/50 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-ghost border-none text-sub hover:text-foreground"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary min-w-30 shadow-lg shadow-primary/10"
                            disabled={isPending}
                        >
                            {isPending ? "Processing..." : Mode === "Add" ? "Create Service" : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
            <Modal/>
        </>
    );
};

export default HandleServiceRequest;