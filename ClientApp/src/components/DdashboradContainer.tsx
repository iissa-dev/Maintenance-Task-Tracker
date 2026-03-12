import type { ResponseRequestDto, DashboardStatsDto } from "../types/index";
import { requestService } from "../services/requestService";

const STATUS_COLORS = [
  { label: "TOTALREQUESTS", color: "text-primary" },
  { label: "PENDING", color: "text-warning" },
  { label: "INPROGRESS", color: "text-secondary" },
  { label: "COMPLETED", color: "text-success" },
];

import { Clock, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import NewRequest from "../forms/NewRequest";
import DashboardChart from "./DashboardChart";
import { ThreeDot } from "react-loading-indicators";

function DashboardContainer() {
  // Status
  const [recentRequest, setRecentRequest] = useState<ResponseRequestDto[]>([]);
  const [status, setStatus] = useState<DashboardStatsDto>();
  const [openAddForm, setOpenAddFrom] = useState(false);
  const [loading, setLoading] = useState(true);
  // Logic

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await requestService.getRecentActivity();

        if (res.isSuccess) {
          setRecentRequest(res.data || []);
        } else {
          console.log(res.message);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, []);

  useEffect(() => {
    const fetchDashboardStatus = async () => {
      try {
        const res = await requestService.getDashboardStats();
        if (res.isSuccess) {
          setStatus(res.data);
        } else {
          console.log(res.message);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboardStatus();
  }, []);

  const result = Object.entries(status ?? "").map(([key, value]) => ({
    label: key,
    value: value,
  }));

  return (
    <>
      {loading ? (
        <div className="fixed top-[50%] left-[50%] -translate-[50%_50%]">
          <ThreeDot
            variant="bounce"
            color="#239c8c"
            size="medium"
            text="lOADING"
            textColor="#0d8988"
          />
        </div>
      ) : (
        <div className="flex min-h-screen">
          <NewRequest
            isOpen={openAddForm}
            onClose={() => setOpenAddFrom(false)}
            Mode="Add"
            data={null}
          />
          {/* 1. Stats Row */}
          <main className="flex-1 p-5 md:p-8 overflow-y-auto">
            <header className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold gradient-text neon-text-purple">
                  Maintenance Overview
                </h1>
                <p className="text-soft">
                  Real-time status of your facility requests
                </p>
              </div>
              <button
                onClick={() => setOpenAddFrom(true)}
                className="btn-primary px-4 py-2 rounded-lg font-medium transition"
              >
                + New Request
              </button>
            </header>

            {/* 2. Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {result.map((stat, i) => (
                <div key={i} className={`card p-6 rounded-2xl neon-border`}>
                  <p className="text-sm font-medium text-slate-500 mb-1">
                    {stat.label.toUpperCase().replace("COUNT", "")}
                  </p>
                  <p className={`text-3xl font-bold ${STATUS_COLORS[i].color}`}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 3. Dashboard Cart */}
              <DashboardChart />

              {/* 4. Recent Requests List */}
              <div className="chart-card p-6 rounded-2xl ">
                <h3 className="font-bold text-soft mb-6">Recent Activity</h3>
                <div className="space-y-6">
                  {recentRequest.map((req) => (
                    <div key={req.id} className="flex items-start gap-4">
                      <div
                        className={`p-2 rounded-lg ${
                          req.status === "Pending"
                            ? "bg-warning/10 text-warning"
                            : req.status === "InProgress"
                              ? "bg-primary/10 text-primary"
                              : "bg-success/10 text-success"
                        }`}
                      >
                        {req.status === "Pending" ? (
                          <Clock size={18} />
                        ) : (
                          <PlayCircle size={18} />
                        )}
                      </div>
                      <div className="flex justify-between w-full">
                        <div>
                          <p className="text-sm font-semibold text-cyan">
                            Costomer Name
                          </p>
                          <p className="text-xs text-slate-500">
                            {req.description}
                          </p>
                        </div>
                        <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded mt-1 flex justify-center items-center">
                          {req.status}
                        </span>
                      </div>
                    </div>
                  ))}
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
