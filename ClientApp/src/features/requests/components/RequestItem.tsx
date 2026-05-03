import React, {useState} from "react";
import {getStatusStyle, type RequestItemProps} from "../utils/request.constants.ts"
import {Calendar, LayersPlus, Tag, Trash2, User} from "lucide-react";

const RequestItem = React.memo(({
                                    request,
                                    employees,
                                    role,
                                    onRemoveRequest,
                                    onAssignTask
                                }: RequestItemProps) => {
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number>(0);

    const handleAssign = async () => {
        const selectedEmployee = employees.find(e => e.id === selectedEmployeeId);
        const employeeName = selectedEmployee ? selectedEmployee.fullName : "Unknown";
        await onAssignTask(request.id, selectedEmployeeId, employeeName);
        setSelectedEmployeeId(0);
    };

    return (
        <div
            className="group bg-card border border-border rounded-2xl p-6 
            hover:border-primary/40 transition-all duration-300 shadow-sm flex flex-col justify-between">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-4">
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-sub/60">
                    <Tag size={12}/> {request.categoryName}
                </span>
                <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${getStatusStyle(request.status)}`}>
                    {request.status}
                </span>
            </div>

            {/* Middle Content */}
            <div className="space-y-3 mb-6">
                <h3 className="text-xl font-bold text-foreground group-hover:text-main transition-colors">
                    {request.name}
                </h3>
                <p className="text-sub text-sm line-clamp-2">{request.description}</p>

                {role === "Admin" && (
                    <div className="mt-4 p-3 bg-muted/30 rounded-xl border border-border/50">
                        <label className="text-[9px] font-black uppercase tracking-widest text-sub mb-2 block">
                            Assign to Employee
                        </label>
                        <select
                            className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary/50 transition-all"
                            value={selectedEmployeeId}
                            onChange={(e) => setSelectedEmployeeId(Number(e.target.value))}
                        >
                            <option value={0}>Select Employee</option>
                            {employees?.map((employee) => (
                                <option value={employee.id} key={employee.id}>
                                    {employee.fullName}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="mt-auto">
                <div className="flex flex-col gap-2 pt-4 border-t border-border/50 mb-4">
                    <div className="flex items-center gap-2 text-xs text-sub/80">
                        <User size={14} className="text-main"/>
                        <span>{request.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-sub/80">
                        <Calendar size={14} className="text-main"/>
                        <span>{request.createdAt?.split("T")[0]}</span>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    {role === "Admin" && (
                        <>
                            <button
                                onClick={() => onRemoveRequest(request.id)}
                                className="p-2 text-danger hover:bg-danger/5 rounded-lg transition-all"
                            >
                                <Trash2 size={16}/>
                            </button>
                            <button
                                onClick={handleAssign}
                                className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-all"
                            >
                                <LayersPlus size={16}/>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
});


export default RequestItem;