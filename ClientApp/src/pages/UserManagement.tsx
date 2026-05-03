import React, {useState} from "react";
import Table from "../components/Table";
import Sidebar from "../layouts/Sidebar";
import type {UpdateUserDto} from "../types";
import {ThreeDot} from "react-loading-indicators";
import {PopupType, usePopup} from "../components/Popup.tsx";
import {HandleUser} from "../features/users/components/HandleUser.tsx";
import {useDeleteUser, useUsers} from "../features/users/api/user.mutation.ts";
import {Search, Filter} from "lucide-react"; 
import Header from "../layouts/Header.tsx";

type FormState =
    | { Mode: "Add"; id: null; data: null }
    | { Mode: "Edit"; id: number; data: UpdateUserDto };

const DEFAULT_FORM_STATE: FormState = {Mode: "Add", id: null, data: null};

function UserManagement() {
    const [PageNumber, setPageNumber] = useState(1);
    const [role, setRole] = useState(2);
    const [open, setOpen] = useState(false);
    const {confirm, alert, Modal} = usePopup();
    const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
    const [search, setSearch] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const PageSize = 10;

    const deleteMutation = useDeleteUser({alert});
    const usersData = useUsers({PageNumber, PageSize, role, appliedSearch});

    if (usersData.isLoading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-background">
                <ThreeDot
                    variant="bounce"
                    color="var(--color-primary)"
                    size="medium"
                    text="LOADING"
                    textColor="var(--color-primary)"
                />
            </div>
        );
    }

    const tableRow = usersData?.users?.map((user) => ({
        id: user.id,
        fullName: user.fullName,
        userName: user.userName,
        email: user.email,
        role: user.role,
    })) ?? [];

    const handleNext = () => {
        if (!usersData.isPlaceholderData && PageNumber < usersData.totalCount)
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

    const handleOpenEdit = (row: any) => {
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
            <div className="flex min-h-screen bg-background">
                <Sidebar/>
                <HandleUser
                    isOpen={open}
                    onClose={handleCloseForm}
                    userId={formState.id ?? 0}
                    Mode={formState.Mode}
                    data={formState.data}
                />

                <main className="p-8 flex-1 flex flex-col max-w-400 mx-auto w-full">
                    <Header title={"User Management"} subtitle={"Control access and user permissions"}
                            buttonText={"New User"}
                            addButton={() => {
                                setFormState(DEFAULT_FORM_STATE);
                                setOpen(true);
                            }}/>

                    {/* Filter Bar */}
                    <div className="flex flex-col mt-auto md:flex-row gap-4 items-center justify-between mb-2">
                        <div className="flex gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-sub" size={16}/>
                                <input
                                    className="w-full bg-card border border-border py-2.5 pl-10 pr-4 outline-none rounded-xl focus:border-primary/50 transition-all placeholder:text-sub/50"
                                    type="text"
                                    placeholder="Search by username..."
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    value={search}
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                className="btn-secondary px-6"
                            >
                                Search
                            </button>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <span className="text-sub text-sm font-bold flex items-center gap-1">
                                <Filter size={14}/> ROLE:
                            </span>
                            <select
                                className="bg-card border border-border p-2.5 outline-none rounded-xl text-sm font-bold text-main min-w-35"
                                value={role}
                                onChange={handleRole}
                            >
                                <option value={3}>Client</option>
                                <option value={2}>Employee</option>
                            </select>
                        </div>
                    </div>

                    <Table
                        tableHeader={["Full Name", "User Name", "Email", "Role"]}
                        tableData={tableRow}
                        pageInfo={{PageNumber, PageSize: usersData.totalCount ?? 0}}
                        onDelete={handleDelete}
                        onEdit={handleOpenEdit}
                        onNext={handleNext}
                        onPrev={handlePrev}
                    />
                </main>
            </div>
            <Modal/>
        </>
    );
}

export default UserManagement;