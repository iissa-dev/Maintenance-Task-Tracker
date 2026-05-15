import { usePopup } from "../../../components/Popup";
import type { CategoryDto } from "../../../types";
import { useAddCategory, useUpdateCategory } from "../api/category.mutaions";
import { useCategoryForm } from "../hooks/useCategoryForm";
import { INPUTS } from "../utils/category.constants";

type BaseProps = {
  isOpen: boolean;
  onClose: () => void;
};

type Props =
  | ({ Mode: "Add"; data?: null } & BaseProps)
  | ({ Mode: "Edit"; data: CategoryDto } & BaseProps);

const HandleCategory = ({ isOpen, onClose, Mode, data }: Props) => {
  const { alert, Modal } = usePopup();
  const { register, handleSubmit } = useCategoryForm({
    isOpen,
    mode: Mode,
    data,
  });
  const addCategoryMutation = useAddCategory(alert, onClose);
  const updateCategoryMutaion = useUpdateCategory(alert, onClose);
  const onSubmit = handleSubmit((formValue) => {
    if (Mode === "Add") {
      addCategoryMutation.mutate(formValue.category.name);
    } else {
      updateCategoryMutaion.mutate({id: data.id, name: formValue.category.name})
    }
  });

 
  if (!isOpen) return null;
  return (
    <>
      {/*Backdrop*/}
      <div
        className="fixed inset-0 z-999 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div
        className="fixed w-[90%] max-w-md top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-1000 
         bg-card border border-border p-8 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200"
      >
        <h1 className="text-2xl font-bold text-main mb-8 text-center">
          {Mode === "Edit" ? "Edit Category" : "New Category"}
        </h1>

        <form onSubmit={onSubmit} className="flex flex-col">
          <div className="flex flex-col gap-1.5 mb-6">
            {INPUTS.map((input) => (
              <div key={input.id} className="flex flex-col gap-1.5 mb-4">
                <label
                  htmlFor={input.id}
                  className="text-[11px] font-black uppercase tracking-widest text-sub ml-1"
                >
                  {input.placeholder}
                </label>
                <input
                  {...register(input.name === "name" ? "category.name": input.name as any , { required: true })}
                  type={input.type}
                  id={input.id}
                  placeholder={`Enter ${input.placeholder.toLocaleLowerCase()}...`}
                  className="px-4 py-2.5 bg-muted/30 border border-border outline-none rounded-xl text-sm
                                focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all
                                placeholder:text-sub/30 text-foreground"
                />
              </div>
            ))}
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
            >
              {addCategoryMutation.isPending
                ? "Saving..."
                : Mode === "Add"
                  ? "Create Category"
                  : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
      <Modal />
    </>
  );
};

export default HandleCategory;
