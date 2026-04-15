import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../../../services/categoryService";
import { usePopup } from "../../../components/Popup";
import { useRequestForm } from "../hooks/useRequestForm";
import { useAddRequest, useEditRequest } from "../api/request.mutations";
import type { ResponseRequestDto } from "../../../types";
import { RequestStatus } from "../utils/request.constants";

type BaseProps = {
  isOpen: boolean;
  onClose: () => void;
};

type Props =
  | ({ Mode: "Add"; data?: null } & BaseProps)
  | ({ Mode: "Edit"; data: ResponseRequestDto } & BaseProps);

function NewRequest({ isOpen, onClose, Mode, data }: Props) {
  const { alert, Modal } = usePopup();

  const { data: categoriesRes } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getAll,
    staleTime: Infinity,
  });

  const categories = useMemo(
    () => categoriesRes?.data ?? [],
    [categoriesRes?.data],
  );

  const addMutation = useAddRequest(alert, onClose);
  const editMutation = useEditRequest(data?.id ?? 0, onClose, alert);

  const { register, handleSubmit } = useRequestForm(
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
      <div className="overlay z-50 fixed inset-0 bg-black/25" />

      <div className="fixed w-100 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-1000 bg-(--color-background) neon-border p-5 rounded-[10px]">
        <h1 className="text-[30px] font-bold text-center mb-5">
          {Mode === "Edit" ? "Edit Request" : "New Request"}
        </h1>

        <form className="flex flex-col" onSubmit={onSubmit}>
          <label htmlFor="description">Description</label>

          <input
            {...register("description", { required: true })}
            id="description"
            type="text"
            className="px-2.5 py-1.25 border border-(--color-muted-foreground) outline-none rounded-[20px] mb-5"
          />
          <label htmlFor="categoryId">Category</label>

          <select
            className="px-2.5 py-1.25 border border-muted-foreground outline-none rounded-[20px] mb-5"
            {...register("categoryId", { valueAsNumber: true })}
          >
            {categories.map((c) => (
              <option
                className="bg-(--color-background) text-soft"
                key={c.id}
                value={c.id}
              >
                {c.name}
              </option>
            ))}
          </select>
          {Mode === "Edit" && (
            <>
              <label htmlFor="status">Status</label>

              <select
                className="px-2.5 py-1.25 border border-muted-foreground outline-none rounded-[20px] mb-5"
                {...register("status", { valueAsNumber: true })}
              >
                {Object.entries(RequestStatus).map(([label, value]) => (
                  <option
                    className="bg-(--color-background) text-soft"
                    key={value}
                    value={value}
                  >
                    {label}
                  </option>
                ))}
              </select>
            </>
          )}

          <div className="flex gap-2.5 justify-end">
            <button
              className="p-[4px_16px] btn-ghost rounded-md cursor-pointer disabled:opacity-50"
              disabled={isPending}
            >
              {isPending ? "..." : Mode}
            </button>

            <button
              className="p-[4px_16px] btn-danger rounded-md cursor-pointer disabled:opacity-50"
              type="button"
              onClick={onClose}
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

export default NewRequest;
