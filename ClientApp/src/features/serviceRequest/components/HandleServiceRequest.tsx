import { useQuery } from "@tanstack/react-query";
import { usePopup } from "../../../components/Popup";
import type {
  AddServiceRequestDto,
  ServiceRequestResponseDto,
  UpdateServiceRequestDto,
} from "../../../types";
import { categoryService } from "../../../services/categoryService";
import {
  useAddServiceRequest,
  useUpdateServiceRequest,
} from "../api/serviceRequest.mutation";
import { useServiceRequestForm } from "../hooks/useServiceRequestForm";
import { INPUTS } from "../utils/serviceRequest.constants";

type BaseProps = {
  isOpen: boolean;
  onClose: () => void;
};

type Props =
  | ({ Mode: "Add"; data?: null } & BaseProps)
  | ({ Mode: "Edit"; data: ServiceRequestResponseDto } & BaseProps);

const HandleServiceRequest = ({ isOpen, onClose, Mode, data }: Props) => {
  const { alert, Modal } = usePopup();

  const { data: categoriesRes } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getAll,
    staleTime: Infinity,
  });

  const categories = categoriesRes?.data ?? [];

  const addMutation = useAddServiceRequest(alert, onClose);
  const editMutation = useUpdateServiceRequest(onClose, alert);

  const { register, handleSubmit } = useServiceRequestForm(
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
      <div className="overlay fixed z-999 w-screen h-screen bg-black/25 backdrop-blur-[2px] inset-0"></div>
      <div
        className="fixed w-100 top-[50%] left-[50%]
     translate-x-[-50%] translate-y-[-50%] z-1000 bg-(--color-background) neon-border p-5 rounded-[10px]"
      >
        <h1 className="text-[30px] font-bold text-center mb-5">
          {Mode === "Edit" ? "Edit Service" : "New Service"}
        </h1>
        <form onSubmit={onSubmit} className="flex flex-col ">
          {INPUTS.map((input) => (
            <input
              {...register(input.name, {
                required: true,
                valueAsNumber: input.type === "number",
              })}
              type={input.type}
              placeholder={input.placeholder}
              key={input.id}
              className="px-2.5 py-1.25 border border-(--color-muted-foreground) outline-none rounded-[20px] mb-5"
            />
          ))}
          <select
            {...register("categoryId", { required: true, valueAsNumber: true })}
            className="px-2.5 py-1.5 border border-muted-foreground outline-none rounded-[20px] mb-5"
          >
            {categories?.map((c) => (
              <option
                className="bg-(--color-background) text-soft"
                key={c.id}
                value={c.id}
              >
                {c.name}
              </option>
            ))}
          </select>
          <div className="flex gap-2.5 justify-end">
            <button
              type="submit"
              className="p-[4px_16px] btn-ghost rounded-md cursor-pointer"
              disabled={isPending}
            >
              {isPending ? "..." : Mode}
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

export default HandleServiceRequest;
