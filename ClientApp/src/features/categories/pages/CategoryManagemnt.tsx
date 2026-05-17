import Table from "../../../components/Table";
import { useCategory, useDeleteCategory } from "../api/category.mutaions";
import Header from "../../../layouts/Header";
import Sidebar from "../../../layouts/Sidebar";
import HandleCategory from "../components/HandleCategory";
import { useState } from "react";
import {  usePopup } from "../../../components/Popup";
import type { CategoryDto } from "../../../types";
import { PopupType } from "../../../types/popup.types";

function CategoryManagemnt() {
  const { confirm, alert, Modal } = usePopup();
  const categories = useCategory();
  const tableData =
    categories?.map((category) => ({
      id: category.id,
      name: category.name,
    })) ?? [];

const [categoryModal, setCategoryModal] = useState<
  | { isOpen: boolean; mode: "Add"; data?: null }
  | { isOpen: boolean; mode: "Edit"; data: CategoryDto }
>({ isOpen: false, mode: "Add" });

  const deleteCategoryMutation = useDeleteCategory({alert});

  const handleDelete = async (id: number) => {
    const ok = await confirm(
      "Are you Sure you want to delete Category",
      "Delete",
      PopupType.WARNING,
    );

    if (!ok) return;

    deleteCategoryMutation.mutate(id);
  };

  const handleUpdate = (data: CategoryDto) => {
    setCategoryModal({isOpen: true, mode: "Edit", data})
  };
  const openAdd = () => setCategoryModal({ isOpen: true, mode: "Add" });
  return (
    <div className="flex">
      <Sidebar />

      <HandleCategory
        isOpen={categoryModal.isOpen}
        onClose={() => setCategoryModal(prev=> ({...prev, isOpen: false}))}
        Mode={categoryModal.mode}
        data={categoryModal.data ?? null}
      />

      <div className="p-4 md:p-6 flex-1 flex flex-col max-w-400 mx-auto w-full">
        <Header
          title={"Category Management"}
          subtitle={"Manage and view service categories"}
          showAddButton={true}
          allowadRoles={["Admin"]}
          buttonText="Add New Category"
          addButton={openAdd}
        />

        <div className="mt-auto">
          <Table
            tableHeader={["Category Id", "Category Name"]}
            tableData={tableData}
            showId={true}
            pageInfo={{
              PageNumber: 1,
              PageSize: 100,
            }}
            onDelete={(id) => handleDelete(id)}
            onEdit={(data) => handleUpdate(data)}
            onNext={function (): void {
              throw new Error("Function not implemented.");
            }}
            onPrev={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        </div>
      </div>
      <Modal />
    </div>
  );
}

export default CategoryManagemnt;
