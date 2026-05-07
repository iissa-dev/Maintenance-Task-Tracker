import { useMemo } from "react";
import { useDashboardStats } from "../api/dashboard.mutations";
import { STATUS_COLORS } from "../utils/dashboard.constants";

const DashboardStatsCard = () => {
  const { dashboardStats } = useDashboardStats();

  const stateArray = useMemo(() => {
    if (!dashboardStats) return [];

    return Object.entries(dashboardStats).map(([key, value]) => ({
      label: key.replace("Count", "").toUpperCase(),
      value: value as number,
      key,
    }));
  }, [dashboardStats]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {stateArray?.map((stat) => (
        <div key={stat.key} className="card p-6 flex flex-col justify-between">
          <p className="text-xs font-bold text-sub tracking-widest mb-3">
            {stat.label}
          </p>
          <p
            className={`text-4xl font-black ${STATUS_COLORS[stat.key] || "text-foreground"}`}
          >
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DashboardStatsCard;
