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
      <div className="overlay fixed z-999 w-screen h-screen bg-black/25 backdrop-blur-[2px] inset-0"></div>
      <div
        className="fixed w-100 top-[50%] left-[50%]
     translate-x-[-50%] translate-y-[-50%] z-1000 bg-(--color-background) neon-border p-5 rounded-[10px]"
      >
        <h1 className="text-[30px] font-bold text-center mb-5">
          {Mode === "Edit" ? "Edit Employee" : "New Employee"}
        </h1>
        <form className="flex flex-col " onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2.5 mb-2.5">
            {INPUTS.filter((input) => Mode === "Add" || input.showOnEdit).map(
              (input) => (
                <div key={input.id} className="form-box relative">
                  <input
                    {...register(input.name as keyof AddUserDto, {
                      required: true,
                    })}
                    className="rounded-[30px] p-2.5 w-full text-[15px] mb-1.25 border border-[#ccc] outline-none placeholder:text-[13px]"
                    type={input.type}
                    placeholder={input.placeholder}
                    id={input.id}
                  />
                  <FontAwesomeIcon
                    icon={input.icon}
                    className="absolute top-[50%] right-2.5 translate-y-[-50%]"
                  />
                </div>
              ),
            )}
          </div>
          <div className="flex gap-2.5 justify-end">
            <button
              disabled={isPending}
              type="submit"
              className="p-[4px_16px] btn-ghost rounded-md cursor-pointer"
            >
              {Mode === "Edit" ? "Edit" : "Add"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-[4px_16px] btn-danger rounded-md cursor-pointer"
            >
              Close
            </button>
          </div>
        </form>
      </div>
      <Modal />
    </>
  );
};
