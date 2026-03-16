import { useEffect, useMemo } from "react";
import type {
  RequestDto,
  ResponseRequestDto,
  UpdateRequestDto,
} from "../types/index";
import { categoryService } from "../services/categoryService";
import { requestService } from "../services/requestService";
import { PopupType, usePopup } from "../components/Popup";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type AddMode = { Mode: "Add"; data?: null };
type EditMode = { Mode: "Edit"; data: ResponseRequestDto };

type Props = (AddMode | EditMode) & {
  isOpen: boolean;
  onClose: () => void;
};

type FormValues = {
  description: string;
  categoryId: number;
  status: number;
};

const STATUS_MAP: Record<string, number> = {
  Pending: 0,
  InProgress: 1,
  Completed: 2,
};

function NewRequest({ isOpen, onClose, Mode, data }: Props) {
  const { confirm, alert, Modal } = usePopup();
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, control } = useForm<FormValues>({
    defaultValues: { description: "", categoryId: 1, status: 0 },
  });

  const { data: categoriesRes } = useQuery({
    queryFn: () => categoryService.getAll(),
    queryKey: ["categories"],
    staleTime: Infinity,
  });
  const categories = useMemo(
    () => categoriesRes?.data ?? [],
    [categoriesRes?.data],
  );

  const addMutation = useMutation({
    mutationFn: async (formData: RequestDto) => {
      const res = await requestService.addNewRequest(formData);
      if (!res.isSuccess) throw new Error(res.message);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      onClose();
    },
    onError: async (error: Error) => {
      await alert(error.message, "Error", PopupType.DANGER);
    },
  });

  const editMutation = useMutation({
    mutationFn: async (formData: UpdateRequestDto) => {
      const res = await requestService.updateReqeust(data?.id ?? 0, formData);
      if (!res.isSuccess) throw new Error(res.message);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      onClose();
    },
    onError: async (error: Error) => {
      await alert(error.message, "Error", PopupType.DANGER);
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    if (Mode === "Edit" && data) {
      const categoryId =
        categories.find((c) => c.name === data.categoryName)?.id ?? 1;
      reset({
        description: data.description,
        categoryId,
        status: STATUS_MAP[data.status] ?? 0,
      });
    } else {
      reset({ description: "", categoryId: 1, status: 0 });
    }
  }, [isOpen, data, Mode, categories, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    const sure = await confirm(
      `Are you sure you want to ${Mode === "Add" ? "add" : "update"} this request?`,
      Mode === "Add" ? "Adding" : "Updating",
      PopupType.INFO,
    );
    if (!sure) return;

    if (Mode === "Add") {
      addMutation.mutate({
        description: formData.description,
        categoryId: formData.categoryId,
      });
    } else {
      editMutation.mutate({
        description: formData.description,
        categoryId: formData.categoryId,
        status: formData.status,
      });
    }
  };

  if (!isOpen) return null;

  const isPending = addMutation.isPending || editMutation.isPending;

  return (
    <>
      <div className="overlay fixed z-999 w-screen h-screen bg-black/25 backdrop-blur-[2px] inset-0" />
      <div className="fixed w-100 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-1000 bg-(--color-background) neon-border p-5 rounded-[10px]">
        <h1 className="text-[30px] font-bold text-center mb-5">
          {Mode === "Edit" ? "Edit Request" : "New Request"}
        </h1>

        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          {/* Description */}
          <label htmlFor="description">Description</label>
          <input
            {...register("description", { required: true })}
            id="description"
            type="text"
            className="px-2.5 py-1.25 border border-(--color-muted-foreground) outline-none rounded-[20px] mb-5"
          />

          {/* Category */}
          <label htmlFor="categoryId">Category</label>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                className="px-2.5 py-1.25 border border-muted-foreground outline-none rounded-[20px] mb-5"
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
            )}
          />

          {Mode === "Edit" && (
            <>
              <label htmlFor="status">Status</label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="px-2.5 py-1.25 border border-muted-foreground outline-none rounded-[20px] mb-6"
                  >
                    <option
                      className="bg-(--color-background) text-soft"
                      value={0}
                    >
                      Pending
                    </option>
                    <option
                      className="bg-(--color-background) text-soft"
                      value={1}
                    >
                      InProgress
                    </option>
                    <option
                      className="bg-(--color-background) text-soft"
                      value={2}
                    >
                      Completed
                    </option>
                  </select>
                )}
              />
            </>
          )}

          <div className="flex gap-2.5 justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="p-[4px_16px] btn-ghost rounded-md cursor-pointer disabled:opacity-50"
            >
              {isPending ? "..." : Mode === "Edit" ? "Edit" : "Add"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="p-[4px_16px] btn-danger rounded-md cursor-pointer disabled:opacity-50"
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
