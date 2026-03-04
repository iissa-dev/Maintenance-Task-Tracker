import type {
  MaintenanceRequestDto,
  CategoryWithRequestCountDto,
  DashboardStatsDto,
} from "../types/index";
import { categoryService } from "../services/categoryService";
import { requestService } from "../services/requestService";

const STATUS_COLORS = [
  {
    label: "TOTALREQUESTS",
    color: "text-blue-600",
  },
  { label: "PENDING", color: "text-yellow-600" },
  {
    label: "INPROGRESS",
    color: "text-purple-600",
  },
  {
    label: "COMPLETED",
    color: "text-green-600",
  },
];

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Clock, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import NewRequest from "./NewRequest";

function Chart() {
  // Status
  const [categories, setCategories] = useState<CategoryWithRequestCountDto[]>(
    [],
  );
  const [recentRequest, setRecentRequest] = useState<MaintenanceRequestDto[]>(
    [],
  );

  const [status, setStatus] = useState<DashboardStatsDto>();
  const [openAddForm, setOpenAddFrom] = useState(false);
  // Logic
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await categoryService.getTopThreeCategories();
        if (res.isSuccess) {
          setCategories(res.data);
        } else {
          console.error(res);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await requestService.getRecentActivity();

        if (res.isSuccess) {
          setRecentRequest(res.data);
        } else {
          console.log(res.message);
        }
      } catch (err) {
        console.error(err);
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
  const chartData = categories.map((c) => ({
    name: c.name,
    count: c.requestCount,
  }));

  const result = Object.entries(status ?? "").map(([key, value]) => ({
    label: key,
    value: value,
  }));

  return (
    <>
      <NewRequest isOpen={openAddForm} onClose={() => setOpenAddFrom(false)} />
      <div className="flex min-h-screen bg-slate-50 font-sans">
        {/* 1. Stats Row */}
        <main className="flex-1 p-8 overflow-y-auto">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Maintenance Overview
              </h1>
              <p className="text-slate-500">
                Real-time status of your facility requests
              </p>
            </div>
            <button
              onClick={() => setOpenAddFrom(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm"
            >
              + New Request
            </button>
          </header>

          {/* 2. Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {result.map((stat, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl border border-slate-100 bg-white shadow-sm`}
              >
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
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-700 mb-6">
                Distribution by Category
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip
                      cursor={{ fill: "#f8fafc" }}
                      contentStyle={{ borderRadius: "12px", border: "none" }}
                    />
                    <Bar
                      dataKey="count"
                      fill="#3b82f6"
                      radius={[6, 6, 0, 0]}
                      barSize={50}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 4. Recent Requests List */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-700 mb-6">Recent Activity</h3>
              <div className="space-y-6">
                {recentRequest.map((req) => (
                  <div key={req.id} className="flex items-start gap-4">
                    <div
                      className={`p-2 rounded-lg ${
                        req.status === "Pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : req.status === "In Progress"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-green-100 text-green-600"
                      }`}
                    >
                      {req.status === "Pending" ? (
                        <Clock size={18} />
                      ) : (
                        <PlayCircle size={18} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {req.customerName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {req.description}
                      </p>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded mt-1 inline-block">
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
    </>
  );
}

export default Chart;
