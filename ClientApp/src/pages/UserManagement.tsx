import { useState } from "react";
import Table from "../components/Table";
import Sidebar from "../layouts/Sidebar";
import type { UpdateUserDto } from "../types";
import { userService } from "../services/userService.ts";
import { ThreeDot } from "react-loading-indicators";
import { PopupType, usePopup } from "../components/Popup.tsx";
import { useQuery } from "@tanstack/react-query";
import { HandleUser } from "../features/users/components/HandleUser.tsx";
import { useDeleteUser } from "../features/users/api/user.mutation.ts";

type FormState =
  | { Mode: "Add"; id: null; data: null }
  | { Mode: "Edit"; id: number; data: UpdateUserDto };

const DEFAULT_FORM_STATE: FormState = { Mode: "Add", id: null, data: null };

function UserManagement() {
  const [PageNumber, setPageNumber] = useState(1);
  const [role, setRole] = useState(2);
  const [open, setOpen] = useState(false);
  const { confirm, alert, Modal } = usePopup();
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const PageSize = 10;

  const { data, isLoading, isPreviousData } = useQuery({
    queryFn: () =>
      userService.users({
        PageNumber,
        PageSize,
        role,
        searchByUserName: appliedSearch,
      }),
    queryKey: ["users", appliedSearch, PageNumber, role],
    keepPreviousData: true,
  });

  const deleteMutation = useDeleteUser({ alert });
  const users = data?.data?.items;
  const totalPages = data?.data?.totalPages ?? 1;

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

  const tableRow =
    users?.map((user) => ({
      id: user.id,
      fullName: user.fullName,
      userName: user.userName,
      email: user.email,
      role: user.role,
    })) ?? [];

  type TableRow = {
    id: number;
    fullName: string;
    userName: string;
    email: string;
    role: string;
  };

  const handleNext = () => {
    if (!isPreviousData && PageNumber < totalPages)
      setPageNumber((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (PageNumber > 1) setPageNumber((prev) => prev - 1);
  };

  const handleRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(Number(e.target.value));
    setPageNumber(1);
    setSearch("");
    setAppliedSearch("");
  };

  const handleDelete = async (id: number) => {
    const ok = await confirm(
      `Are you sure you want to delete User with id ${id}?`,
      "Delete",
      PopupType.WARNING,
    );
    if (!ok) return;

    await deleteMutation.mutateAsync(id);
    await alert("User deleted successfully.", "Delete", PopupType.INFO);
  };

  const handleOpenEdit = (row: TableRow) => {
    const [firstName, ...rest] = row.fullName.split(" ");
    setFormState({
      Mode: "Edit",
      id: row.id,
      data: {
        firstName,
        lastName: rest.join(" "),
        email: row.email,
        userName: row.userName,
      },
    });
    setOpen(true);
  };

  const handleCloseForm = () => {
    setOpen(false);
    setFormState(DEFAULT_FORM_STATE);
  };

  const handleSearch = () => {
    setPageNumber(1);
    setAppliedSearch(search);
  };
  return (
    <>
      <div className="flex">
        <Sidebar />
        <HandleUser
          isOpen={open}
          onClose={handleCloseForm}
          userId={formState.id ?? 0}
          Mode={formState.Mode}
          data={formState.data}
        />
        <div className="p-5 flex-1 overflow-auto flex flex-col">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold gradient-text neon-text-purple">
                User Management
              </h1>
              <p className="text-soft">Manage Users</p>
            </div>
            <button
              onClick={() => {
                setFormState(DEFAULT_FORM_STATE);
                setOpen(true);
              }}
              className="btn-primary px-4 py-2 rounded-lg font-medium transition"
            >
              + New Employee
            </button>
          </header>
          <div className="mt-auto">
            <div className="flex gap-3">
              <input
                className="w-80 border border-muted-foreground py-1 px-3 outline-none rounded-md placeholder:text-xs"
                type="text"
                placeholder="Search by username..."
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                value={search}
              />
              <input
                onClick={handleSearch}
                className="btn-primary"
                type="button"
                value="Search"
              />
              <select
                className="border border-muted-foreground p-1 outline-none rounded-md"
                value={role}
                onChange={handleRole}
              >
                <option className="bg-background" value={3}>
                  Client
                </option>
                <option className="bg-background" value={2}>
                  Employee
                </option>
              </select>
            </div>
            <Table
              tableHeader={["Id", "Full Name", "User Name", "Email", "Role"]}
              tableData={tableRow}
              pageInfo={{ PageNumber, PageSize: totalPages }}
              onDelete={handleDelete}
              onEdit={handleOpenEdit}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          </div>
        </div>
      </div>
      <Modal />
    </>
  );
}

export default UserManagement;
