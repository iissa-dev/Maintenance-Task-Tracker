import {useAuth} from "../../../hooks/useAuth.ts";
import {type RequestCardProps} from "../utils/request.constants.ts"
import {ChevronLeft, ChevronRight} from "lucide-react";
import UseCategory from "../../../hooks/useCategory.ts";
import RequestItem from "./RequestItem.tsx";
import React from "react";


const RequestCard = React.memo(({
                                    requests,
                                    employees,
                                    onRemoveRequest,
                                    onGoNext,
                                    onGoBack,
                                    onAssignTask,
                                    onCategoryIdSelect,
                                }: RequestCardProps) => {
    const {authToken} = useAuth();
    const role = authToken?.role ?? "Client";
    const categories = UseCategory() ?? [];

    return (
        <div className="space-y-8">
            {/* Top Bar */}
            <div
                className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card/50 p-4 rounded-2xl border border-border">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <label htmlFor="category"
                           className="text-sm font-bold text-sub uppercase tracking-widest whitespace-nowrap">
                        Filter By:
                    </label>
                    <select
                        name="category"
                        id="category"
                        className="bg-background border border-border text-foreground text-sm rounded-xl px-4 py-2 outline-none focus:border-primary/50 transition-all w-full md:w-48"
                        onChange={(e) => onCategoryIdSelect(Number(e.target.value))}
                    >
                        <option value={0}>All Categories</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-3">
                    <button onClick={onGoBack}
                            className="btn-ghost p-2 rounded-xl border border-border hover:bg-muted transition-all">
                        <ChevronLeft size={20}/>
                    </button>
                    <button onClick={onGoNext}
                            className="btn-ghost p-2 rounded-xl border border-border hover:bg-muted transition-all">
                        <ChevronRight size={20}/>
                    </button>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {requests?.map((request) => (
                    <RequestItem
                        key={request.id}
                        request={request}
                        employees={employees}
                        role={role}
                        onRemoveRequest={onRemoveRequest}
                        onAssignTask={onAssignTask}
                    />
                ))}
            </div>
        </div>
    );
})

export default RequestCard;