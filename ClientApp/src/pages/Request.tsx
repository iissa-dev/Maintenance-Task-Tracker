import { useEffect, useState } from "react";
import Sidebar from "../layouts/Sidebar";
import "./Request.css";
import NewRequest from "../forms/NewRequest";
import Table from "../components/Table";
import type { ResponseRequestDto, PageResult } from "../types";
import { requestService } from "../services/requestService";
import { usePopup, PopupType } from "../components/Popup";

function Request() {
  // States
  const [open, setOpen] = useState(false);
  const [requests, setRequests] = useState<ResponseRequestDto[]>([]);
  const [pageInfo, setPageInfo] = useState<PageResult<ResponseRequestDto[]>>();
  const [currentPage, setCurrentPage] = useState(pageInfo?.pageNumber ?? 1);
  const [reload, setReload] = useState(false);
  const { confirm, Modal } = usePopup();
  const [requestToUpdate, setRequestToUpdate] = useState<ResponseRequestDto>();
  const [loading, setLoading] = useState(false);
  const tableData = requests.map((request) => ({
    id: request.id,
    categoryName: request.categoryName,
    createdAt: request.createdAt,
    description: request.description,
    status: request.status,
  }));
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        setLoading(true);
        const res = await requestService.getAll({
          pageNumber: currentPage,
          pageSize: 4,
        });
        if (res.totalPages != 0) {
          setRequests(res.items);
          setPageInfo(res);
          setCurrentPage(res.pageNumber);
        } else console.log("Empty");
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [currentPage, reload]);

  // Logic
  const handleDelete = async (id: number) => {
    const ok = await confirm(
      `Are you sure you want to delete request with Id: ${id}?`,
      "Delete",
      PopupType.WARNING,
    );
    if (!ok) return;

    try {
      const res = await requestService.delete(id);

      if (res.isSuccess) {
        setReload(true);
      } else {
        console.log(res?.message || "Flaid to delete");
      }
    } catch (err) {
      console.error(err);
    }
  };
  type TableRow = (typeof tableData)[number];

  const handleEdit = async (data: TableRow) => {
    setRequestToUpdate({
      id: data.id,
      categoryName: data.categoryName,
      createdAt: data.createdAt,
      description: data.description,
      status: data.status,
      categoryId: 0,
    });
    setOpen(true);
  };
  const goNext = () => {
    if (!pageInfo) return;
    if (!currentPage) return;
    if (pageInfo?.pageNumber < pageInfo?.totalPages) {
      setCurrentPage((prev) => (prev += 1));
    }
  };
  const goPrev = () => {
    if (!pageInfo) return;
    if (!currentPage) return;
    if (currentPage > 1) {
      setCurrentPage((prev) => (prev -= 1));
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-5 overflow-auto relative">
        <Table
          tableHeader={["Id", "Category", "CreatedAt", "Description", "Status"]}
          tableData={tableData}
          onDelete={(id) => handleDelete(id)}
          onEdit={(data) => handleEdit(data)}
          onNext={goNext}
          onPrev={goPrev}
          loading={loading}
          pageInfo={{
            PageNumber: currentPage,
            PageSize: pageInfo?.totalPages ?? 10,
          }}
          onReload={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
        <NewRequest
          isOpen={open}
          onClose={() => setOpen(false)}
          Mode="Edit"
          data={requestToUpdate ?? null}
        />
      </div>
      <Modal />
    </div>
  );
}

export default Request;
