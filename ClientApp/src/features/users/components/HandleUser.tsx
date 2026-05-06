import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePopup } from "../../../components/Popup";
import type { AddUserDto, UpdateUserDto } from "../../../types";
import { INPUTS } from "../utils/user.constant";
import { useAddUser, useUpdateUser } from "../api/user.mutation";
import { useUserForm } from "../hooks/useUserForm";

type BaseProps = {
    isOpen: boolean;
    onClose: () => void;
    userId: number;
};

type Props = BaseProps & {
    Mode: "Add" | "Edit";
    data?: UpdateUserDto | null;
};

export const HandleUser = ({ isOpen, onClose, Mode, data, userId }: Props) => {
    const { alert, Modal } = usePopup();
    const { register, handleSubmit } = useUserForm(
        isOpen,
        Mode,
        data ?? undefined,
    );

    const addMutation = useAddUser({ onClose, alert });
    const updateMutation = useUpdateUser({ onClose, alert });

    const onSubmit = (formData: AddUserDto | UpdateUserDto) => {
        if (Mode === "Add") {
            addMutation.mutate(formData as AddUserDto);
        } else {
            updateMutation.mutate({ id: userId, data: formData as UpdateUserDto });
        }
    };

    if (!isOpen || (Mode === "Edit" && !data)) return null;

    const isPending = addMutation.isPending || updateMutation.isPending;

    return (
        <>
            <div
                className="fixed inset-0 z-999 bg-background/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div
                className="fixed w-[90%] max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-1000 
                           bg-card border border-border p-8 rounded-2xl shadow-2xl"
            >
                <h1 className="text-2xl font-bold text-main mb-8 text-center">
                    {Mode === "Edit" ? "Update User Profile" : "Create New User"}
                </h1>

                <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-5 mb-8">
                        {INPUTS.filter((input) => Mode === "Add" || input.showOnEdit).map(
                            (input) => (
                                <div key={input.id} className="relative group">
                                    <label
                                        htmlFor={input.id}
                                        className="text-[11px] font-black uppercase tracking-widest text-sub ml-1 mb-1.5 block"
                                    >
                                        {input.placeholder}
                                    </label>
                                    <div className="relative">
                                        <input
                                            {...register(input.name as keyof AddUserDto, {
                                                required: true,
                                            })}
                                            id={input.id}
                                            type={input.type}
                                            placeholder={`Enter ${input.placeholder.toLowerCase()}...`}
                                            className="w-full bg-muted/30 border border-border px-4 py-3 rounded-xl text-sm 
                                                       outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 
                                                       transition-all placeholder:text-sub/30 pr-10"
                                        />
                                        <FontAwesomeIcon
                                            icon={input.icon}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-sub/40 group-focus-within:text-primary transition-colors"
                                        />
                                    </div>
                                </div>
                            ),
                        )}
                    </div>

                    <div className="flex gap-3 justify-end pt-2 border-t border-border/50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-ghost border-none text-sub hover:text-foreground"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={isPending}
                            type="submit"
                            className="btn-primary min-w-30 shadow-lg shadow-primary/10"
                        >
                            {isPending ? "Saving..." : Mode === "Add" ? "Create User" : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
            <Modal />
        </>
    );
};