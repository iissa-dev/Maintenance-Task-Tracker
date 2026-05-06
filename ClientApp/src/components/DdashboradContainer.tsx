import {useMemo, useEffect, useState} from "react";
import type {ResponseRequestDto, DashboardStatsDto} from "../types";
import {requestService} from "../services/requestService";
import {Clock, PlayCircle} from "lucide-react";
import HandleRequest from "../features/requests/components/HandleRequest";
import DashboardChart from "./dashboardChart";
import {ThreeDot} from "react-loading-indicators";
import Header from "../layouts/Header.tsx";

const STATUS_COLORS: Record<string, string> = {
    totalRequestsCount: "text-main",
    pendingRequestsCount: "text-warning",
    inProgressRequestsCount: "text-purple",
    completedRequestsCount: "text-ok",
};

function DashboardContainer() {
    const [recentRequest, setRecentRequest] = useState<ResponseRequestDto[]>([]);
    const [status, setStatus] = useState<DashboardStatsDto>();
    const [openAddForm, setOpenAddFrom] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [recentRes, statsRes] = await Promise.all([
                    requestService.getRecentActivity(),
                    requestService.getDashboardStats()
                ]);

                if (recentRes.isSuccess) setRecentRequest(recentRes.data || []);
                if (statsRes.isSuccess) setStatus(statsRes.data);
            } catch (err) {
                console.error("Dashboard Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const statsArray = useMemo(() =>
        Object.entries(status ?? {}).map(([key, value]) => ({
            label: key.replace("Count", "").toUpperCase(),
            value: value,
            key: key
        })), [status]);

    return (
        <>
            {loading ? (
                <div className="fixed inset-0 flex items-center justify-center bg-background">
                    <ThreeDot
                        variant="bounce"
                        color="var(--color-primary)"
                        size="medium"
                        text="Loading"
                        textColor="var(--color-primary)"
                    />
                </div>
            ) : (
                <div className="flex min-h-screen bg-background">
                    <HandleRequest
                        isOpen={openAddForm}
                        onClose={() => setOpenAddFrom(false)}
                        Mode="Add"
                        data={null}
                    />

                    <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                        {/* Header */}
                        <Header title={" Maintenance Overview"} subtitle={"Real-time monitoring of facility requests"}
                                buttonText={"New Request"}
                                addButton={() => {
                                    setOpenAddFrom(true);
                                }}/>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                            {statsArray.map((stat) => (
                                <div key={stat.key} className="card p-6 flex flex-col justify-between">
                                    <p className="text-xs font-bold text-sub tracking-widest mb-3">
                                        {stat.label}
                                    </p>
                                    <p className={`text-4xl font-black ${STATUS_COLORS[stat.key] || 'text-foreground'}`}>
                                        {stat.value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Chart Section */}
                            <div className="lg:col-span-2">
                                <DashboardChart/>
                            </div>

                            {/* Recent Activity Section */}
                            <div className="card p-6">
                                <h3 className="font-bold text-main text-lg mb-8 flex items-center gap-2">
                                    <Clock size={20} className="text-primary"/>
                                    Recent Activity
                                </h3>
                                <div className="space-y-8">
                                    {recentRequest.length > 0 ? recentRequest.map((req) => (
                                        <div key={req.id} className="flex items-start gap-4 group">
                                            <div className={`p-2.5 rounded-xl transition-colors ${
                                                req.status === "Pending" ? "bg-warning/10 text-warning" :
                                                    req.status === "InProgress" ? "bg-primary/10 text-primary" :
                                                        "bg-success/10 text-success"
                                                      }`}>
                                                {req.status === "Pending" 
                                                    ? <Clock size={18}/> 
                                                    : <PlayCircle size={18}/>}
                                            </div>

                                            <div
                                                className="flex flex-col flex-1 border-b border-border/50 pb-4 group-last:border-none">
                                                <div className="flex justify-between items-center mb-1">
                                                    <p className="text-sm font-bold text-foreground">
                                                        {req.customerName}
                                                    </p>
                                                    <span className="text-[10px] font-black uppercase tracking-tighter
                                                        px-2 py-0.5 rounded bg-muted text-sub border border-border">
                                                      {req.status}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-sub line-clamp-1 italic">
                                                    "{req.description}"
                                                </p>
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-center text-sub py-10">No recent activity</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            )}
        </>
    );
}

export default DashboardContainer;