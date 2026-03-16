import { useEffect } from "react";
import type { AddUserDto, UpdateUserDto } from "../types";
import {
  faEnvelope,
  faUnlock,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { userService } from "../services/userService";
import { PopupType, usePopup } from "../components/Popup";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type AddMode = {
  Mode: "Add";
  data?: null;
  id?: null;
};

type EditMode = {
  Mode: "Edit";
  data: UpdateUserDto;
  id: number;
};

type Props = (AddMode | EditMode) & {
  isOpen: boolean;
  onClose: () => void;
};

const INPUTS = [
  {
    type: "text",
    name: "firstName",
    id: "firstName",
    placeholder: "First Name",
    icon: faUser,
    showOnEdit: true,
  },
  {
    type: "text",
    name: "lastName",
    id: "lastName",
    placeholder: "Last Name",
    icon: faUser,
    showOnEdit: true,
  },
  {
    type: "email",
    name: "email",
    id: "email",
    placeholder: "Email",
    icon: faEnvelope,
    showOnEdit: true,
  },
  {
    type: "text",
    name: "userName",
    id: "username",
    placeholder: "User Name",
    icon: faUser,
    showOnEdit: true,
  },
  {
    type: "password",
    name: "password",
    id: "password",
    placeholder: "Password",
    icon: faUnlock,
    showOnEdit: false,
  },
] as const;

function NewEmployee({ isOpen, onClose, Mode, data, id }: Props) {
  const { alert, Modal } = usePopup();
  const { register, handleSubmit, reset } = useForm<
    AddUserDto | UpdateUserDto
  >();
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: async (formData: AddUserDto) => {
      const res = await userService.addNewEmployee(formData);
      if (!res.isSuccess) throw new Error(res.message);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onClose();
    },
    onError: async (error: Error) => {
      await alert(error.message, "Error", PopupType.DANGER);
    },
  });

  const editMutation = useMutation({
    mutationFn: (formData: UpdateUserDto) =>
      userService.updateUser(id as number, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onClose();
    },
    onError: async (error) => {
      await alert(`${error}`, "Error", PopupType.DANGER);
    },
  });

  const onSubmit: SubmitHandler<AddUserDto | UpdateUserDto> = (formData) => {
    if (Mode === "Add") {
      addMutation.mutate(formData as AddUserDto);
    } else {
      editMutation.mutate(formData as UpdateUserDto);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    if (Mode === "Edit" && data) reset(data);
    else reset({});
  }, [isOpen, data, Mode, reset]);

  if (!isOpen) return null;

  const isPending = addMutation.isPending || editMutation.isPending;
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
}

export default NewEmployee;
