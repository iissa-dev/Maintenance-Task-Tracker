import type { AddServiceRequestDto, UpdateServiceRequestDto } from "../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { categoryService } from "../services/categoryService";
import { useEffect } from "react";
import { serviceRequestService } from "../services/serviceRequestService";
import { PopupType, usePopup } from "../components/Popup";

type AddMode = {
  Mode: "Add";
  data?: null;
};

type EditMode = {
  Mode: "Edit";
  data?: UpdateServiceRequestDto;
};

type Props = (AddMode | EditMode) & {
  isOpen: boolean;
  onClose: () => void;
};

const INPUTS = [
  {
    type: "text",
    name: "name",
    id: "name",
    placeholder: "Name",
  },
  {
    type: "text",
    name: "description",
    id: "description",
    placeholder: "Description",
  },
  {
    type: "number",
    name: "price",
    id: "price",
    placeholder: "Price",
  },
] as const;

function ServiceHandled({ isOpen, onClose, Mode, data }: Props) {
  const queryClient = useQueryClient();
  const { confirm, alert, Modal } = usePopup();
  const { register, handleSubmit, reset, control } = useForm<
    UpdateServiceRequestDto | AddServiceRequestDto
  >({
    defaultValues: data ?? {},
  });

  const { data: categoriesData } = useQuery({
    queryFn: () => categoryService.getAll(),
    queryKey: ["categories"],
  });
  const categories = categoriesData?.data;
  const onSubmit = async (
    data: UpdateServiceRequestDto | AddServiceRequestDto,
  ) => {
    const sure = await confirm(
      `Are you sure you want to ${Mode === "Add" ? "add" : "update"} this request?`,
      Mode === "Add" ? "Adding" : "Updating",
      PopupType.INFO,
    );
    if (!sure) return;

    if (Mode === "Add") {
      addMutation.mutate(data as AddServiceRequestDto);
    } else {
      updateMutaion.mutate(data as UpdateServiceRequestDto);
    }
  };

  const addMutation = useMutation({
    mutationFn: async (data: AddServiceRequestDto) => {
      const res = await serviceRequestService.addServices(data);

      if (!res.isSuccess) throw new Error(res.message);
      return res;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      await alert("Service Added Successfully", "Add", PopupType.INFO);
      onClose();
    },
    onError: async (error: Error) => {
      await alert(error?.message, "Error", PopupType.DANGER);
    },
  });

  const updateMutaion = useMutation({
    mutationFn: async (data: UpdateServiceRequestDto) => {
      const res = await serviceRequestService.updateServcie(data?.id, data);

      if (!res.isSuccess) throw new Error(res.message);
      return res;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      await alert("Service Added Successfully", "Add", PopupType.INFO);
      onClose();
    },
    onError: async (error: Error) => {
      await alert(error?.message, "Error", PopupType.DANGER);
    },
  });

  useEffect(() => {
    if (Mode === "Edit") {
      reset(data);
    } else if (categories && categories.length > 0) {
      reset({ categoryId: categories[0].id });
    }
  }, [data, Mode, reset, categories]);

  if (!isOpen) return null;
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
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col ">
          {INPUTS.map((input) => (
            <input
              {...register(input.name, { required: true })}
              type={input.type}
              placeholder={input.placeholder}
              key={input.id}
              className="px-2.5 py-1.25 border border-(--color-muted-foreground) outline-none rounded-[20px] mb-5"
            />
          ))}
          <Controller
            name="categoryId"
            control={control}
            defaultValue={categories?.[0]?.id}
            render={({ field }) => (
              <select
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
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
            )}
          />
          <div className="flex gap-2.5 justify-end">
            <button
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

export default ServiceHandled;
