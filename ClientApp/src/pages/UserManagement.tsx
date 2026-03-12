import Table from "../components/Table";
import Sidebar from "../layouts/Sidebar";

function UserManagement() {
  const dataTable = [
    {
      fullName: "Issa",
      userName: "Issa",
      email: "email.com",
      role: "role",
    },
  ];
  return (
    <div className="flex">
      <Sidebar />

      <div className="p-5 flex-1 overflow-auto grid grid-cols-2">
        <div className="col-span-2">
          <Table
            tableHeader={["Full Name", "User Name", "Email", "Role"]}
            tableData={dataTable}
            pageInfo={{
              PageNumber: 0,
              PageSize: 0,
            }}
            loading={false}
            onDelete={function (id: number): void {
              throw new Error("Function not implemented.");
            }}
            onEdit={function (
              data: Record<string, unknown> & { id: number },
            ): void {
              throw new Error("Function not implemented.");
            }}
            onReload={function (): void {
              throw new Error("Function not implemented.");
            }}
            onNext={function (): void {
              throw new Error("Function not implemented.");
            }}
            onPrev={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        </div>
        <div>Table 2</div>
      </div>
    </div>
  );
}

export default UserManagement;
