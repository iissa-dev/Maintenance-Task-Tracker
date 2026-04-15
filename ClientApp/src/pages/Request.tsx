import { useState } from "react";
import Sidebar from "../layouts/Sidebar";
import "./Request.css";
import NewRequest from "../features/requests/components/HandleRequst";
import Table from "../components/Table";
import type { ResponseRequestDto, PageResult } from "../types";
import { requestService } from "../services/requestService";
import { usePopup, PopupType } from "../components/Popup";
import { ThreeDot } from "react-loading-indicators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type FormState =
  | { Mode: "Add"; data: null }
  | { Mode: "Edit"; data: ResponseRequestDto };

const DEFAULT_FORM_STATE: FormState = { Mode: "Add", data: null };

function Request() {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
  const { confirm, alert, Modal } = usePopup();
  const queryClient = useQueryClient();

  const { data, isLoading, isPreviousData } = useQuery({
    queryKey: ["requests", currentPage],
    queryFn: () =>
      requestService.getAll({
        pageNumber: currentPage,
        pageSize: 4,
      }),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await requestService.delete(id);
      if (!res.isSuccess) throw new Error(res.message);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });

  const pageInfo: PageResult<ResponseRequestDto> = data?.data ?? {
    items: [],
    pageNumber: 1,
    pageCount: 1,
    totalItems: 0,
    totalPages: 1,
  };

  if (isLoading) {
    return (
      <div className="fixed top-[50%] left-[50%] -translate-[50%]">
        <ThreeDot
          variant="bounce"
          color="#239c8c"
          size="medium"
          text="LOADING"
          textColor="#0d8988"
        />
      </div>
    );
  }

  const tableData =
    pageInfo.items.map((request) => ({
      id: request.id,
      categoryName: request.categoryName,
      createdAt: request.createdAt,
      description: request.description,
      status: request.status,
    })) ?? [];

  type TableRow = {
    id: number;
    categoryName: string;
    createdAt: string;
    description: string;
    status: ResponseRequestDto["status"];
  };

  const handleDelete = async (id: number) => {
    const ok = await confirm(
      `Are you sure you want to delete request with Id: ${id}?`,
      "Delete",
      PopupType.WARNING,
    );
    if (!ok) return;

    try {
      await deleteMutation.mutateAsync(id);
      await alert("Request deleted successfully.", "Delete", PopupType.INFO);
    } catch (error) {
      await alert(`${error}`, "Delete", PopupType.DANGER);
    }
  };

  const handleEdit = (row: TableRow) => {
    setFormState({
      Mode: "Edit",
      data: {
        id: row.id,
        categoryName: row.categoryName,
        createdAt: row.createdAt,
        description: row.description,
        status: row.status,
        categoryId: 0,
      },
    });
    setOpen(true);
  };

  const handleCloseForm = () => {
    setOpen(false);
    setFormState(DEFAULT_FORM_STATE);
  };

  const goNext = () => {
    if (!isPreviousData && currentPage < pageInfo.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-5 overflow-auto relative">
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => {
              setFormState(DEFAULT_FORM_STATE);
              setOpen(true);
            }}
            className="btn-primary px-4 py-2 rounded-lg font-medium transition"
          >
            + New Request
          </button>
        </div>

        <Table
          tableHeader={["Id", "Category", "CreatedAt", "Description", "Status"]}
          tableData={tableData}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onNext={goNext}
          onPrev={goPrev}
          pageInfo={{
            PageNumber: currentPage,
            PageSize: pageInfo.totalPages ?? 1,
          }}
        />

        <NewRequest
          key={`${formState.Mode}-${formState.data?.id}`}
          isOpen={open}
          onClose={handleCloseForm}
          {...formState}
        />
      </div>

      <Modal />
    </div>
  );
}

export default Request;
