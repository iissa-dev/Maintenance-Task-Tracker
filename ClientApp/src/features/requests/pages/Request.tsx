import { useCallback, useState } from "react";
import { PopupType, usePopup } from "../../../components/Popup";
import {
  useAssignToEmployee,
  useDeleteRequest,
  useRequests,
} from "../api/request.mutations";
import { useUsers } from "../../users/api/user.mutation";
import { ThreeDot } from "react-loading-indicators";
import Header from "../../../layouts/Header";
import RequestCard from "../components/RequestCard";
import "./Request.css";
import Sidebar from "../../../layouts/Sidebar";

function Request() {
  const [pageNumber, setPageNumber] = useState(1);
  const { confirm, alert, Modal } = usePopup();
  const assignMutation = useAssignToEmployee(alert);
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const employees = useUsers({ PageNumber: 1, PageSize: 100, role: 2 });

  const { requests, isLoading, isPlaceholderData, totalPages } = useRequests({
    pageNumber,
    pageSize: 6,
    categoryId,
  });

  const deleteRequest = useDeleteRequest(alert);

  const handleDelete = useCallback(
    async (id: number) => {
      const ok = await confirm(
        `Are you sure you want to delete request with Id: ${id}?`,
        "Delete",
        PopupType.WARNING,
      );
      if (!ok) return;

      var deleted = await deleteRequest.mutateAsync(id);
      if(deleted.isSuccess)
      {
         await alert("Request deleted successfully.", "Delete", PopupType.INFO);
      }
    },
    [confirm, alert, deleteRequest],
  );

  const goNext = useCallback(() => {
    if (!isPlaceholderData && pageNumber < totalPages) {
      setPageNumber((prev) => prev + 1);
    }
  }, [isPlaceholderData, pageNumber, totalPages]);

  const goPrev = useCallback(() => {
    if (pageNumber > 1) {
      setPageNumber((prev) => prev - 1);
    }
  }, [pageNumber]);

  const handleAssign = useCallback(
    async (requestId: number, employeeId: number, employeeName: string) => {
      if (employeeId === 0) {
        await alert(
          "Please select an employee first.",
          "Selection Required",
          PopupType.WARNING,
        );
        return;
      }

      const ok = await confirm(
        `Do you want to assign this task to (${employeeName})?`,
        "Assign Task",
        PopupType.INFO,
      );

      if (!ok) return;

      try {
        await assignMutation.mutateAsync({ requestId, employeeId });
        await alert("Task assigned successfully!", "Success", PopupType.INFO);
      } catch (error) {
        console.error(error);
      }
    },
    [confirm, alert, assignMutation],
  );

  const handleCategorySelect = useCallback((catId: number) => {
    setCategoryId(catId);
    setPageNumber(1);
  }, []);
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
  return (
    <div className="flex">
      <Sidebar />

      <div className="p-8 flex-1 flex flex-col max-w-400 mx-auto w-full">
        <Header
          title={"Request Management"}
          subtitle={"Every thing you need to manage Requests"}
          showAddButton={false}
        />
        <RequestCard
          requests={requests}
          onRemoveRequest={handleDelete}
          onGoNext={goNext}
          onGoBack={goPrev}
          employees={employees.users}
          onAssignTask={handleAssign}
          onCategoryIdSelect={handleCategorySelect}
        />
      </div>

      <Modal />
    </div>
  );
}

export default Request;
