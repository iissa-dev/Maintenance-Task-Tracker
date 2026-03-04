import { useEffect, useState } from "react";
import Sidebar from "../layouts/Sidebar";
import type { MaintenanceRequestDto } from "../types/index";
import "./Request.css";
import { requestService } from "../services/requestService";
import { PopupType, usePopup } from "../components/Popup";

function Request() {
  const [requests, setRequests] = useState<MaintenanceRequestDto[]>([]);
  const { confirm, alert, Modal } = usePopup();
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await requestService.getAll({
          pageNumber: 1,
          pageSize: 10,
        });
        if (res.totalPages != 0) {
          setRequests(res.items);
        } else console.log("Empty");
      } catch (err) {
        console.log(err);
      }
    };

    fetchRequest();
  }, [reload]);

  const handleDelete = async (id: number) => {
    const ok = await confirm(
      "Are you sure you want to delete Request?",
      "Delete",
      PopupType.WARNING,
    );
    if (!ok) return;

    try {
      const res = await requestService.delete(id);
      if (res) {
        await alert("Delete Request Success", "Delete", PopupType.INFO);
        setReload(true);
      } else {
        await alert("Delete Request Failed", "Delete", PopupType.INFO);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="p-8 w-full">
        <h1 className="text-2xl font-bold text-slate-800">
          Request Management
        </h1>
        <p className="text-slate-500">Manage All Request</p>

        <div className="responsive-table flex-1 bg-white rounded-[6px] p-[10px] overflow-auto mt-[30px]">
          <table className="w-full mt-[10px]">
            <thead className="text-nowrap bg-gray-300 text-slate-800">
              <tr>
                <th className="p-[10px]">Id</th>
                <th>Description</th>
                <th>Customer Name</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Category Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="text-center text-nowrap">
              {requests.map((r) => (
                <tr key={r.id} className="p-[20px] border-b-1 border-[#ddd]">
                  <td>{r.id}</td>
                  <td>{r.description}</td>
                  <td>{r.customerName}</td>
                  <td>
                    <span className="bg-red-400/50 p-[6px_12px] rounded-[20px] text-red-500 font-bold ">
                      {r.status}
                    </span>
                  </td>
                  <td>{r.createdAt.split("T")[0]}</td>
                  <td>{r.categoryName}</td>
                  <td className="flex items-center justify-center gap-[5px] p-[20px]">
                    <span
                      onClick={() => handleDelete(r.id)}
                      className="bg-red-400/50 p-[6px_12px] rounded-[6px] text-red-500 font-bold cursor-pointer select-none"
                    >
                      Delete
                    </span>
                    <span className="bg-blue-400/50 p-[6px_12px] rounded-[6px] text-blue-500 font-bold cursor-pointer select-none">
                      Edit
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Modal />
    </div>
  );
}

export default Request;
